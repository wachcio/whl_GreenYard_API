import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { MushroomDescription } from './mushroom-description.entity';
import { MushroomItem } from './mushroom-item.entity';
import { Image } from '../image/entities/image.entity';
import * as path from 'path';
import * as fs from 'fs';
import { mushroomImagePath } from 'src/utils/imagePath';
import { Command, Console } from 'nestjs-console';

import slugify from 'slugify';
import { slugifyConfig } from 'src/utils/slugify-config';

@Injectable()
@Console({
  name: 'mushrooms',
})
export class MushroomService {
  //   constructor(
  //     @Inject(forwardRef(() => MushroomService))
  //     private mushroomService: MushroomService,
  //   ) {}

  async getAllMushrooms(): Promise<MushroomItem[]> {
    return await MushroomItem.find({
      relations: ['description'],
    });
  }

  @Command({
    command: 'list',
    description: 'List all of mushrooms',
  })
  async listMushroomsCmd() {
    console.log(await this.getAllMushrooms());
  }

  async getShortDataAllMushrooms(): Promise<MushroomItem[]> {
    return MushroomItem.find({
      select: [
        'id',
        'polishName',
        'scientificName',
        'anotherNames',
        'application',
        'slug',
        'isLegallyProtected',
        'approvedForTrade',
      ],
    });
  }

  async findMushrooms(searchText: string): Promise<MushroomItem[]> {
    return await MushroomItem.find({
      where: [
        { id: searchText },
        { polishName: Like(`%${searchText}%`) },
        { scientificName: Like(`%${searchText}%`) },
        { anotherNames: Like(`%${searchText}%`) },
        { application: searchText },
      ],
      relations: ['description'],
    });
  }

  @Command({
    command: 'find <searchText>',
    description:
      'Find mushroom (id, polish name, scientific name, another names, application)',
  })
  async findMushroomsCmd(searchText) {
    console.log(await this.findMushrooms(searchText));
  }

  async findSlugMushroom(slug: string): Promise<MushroomItem> {
    return await MushroomItem.findOne({
      where: { slug: slug },
      relations: ['description'],
    });
  }

  @Command({
    command: 'findSlug <searchText>',
    description: 'Find mushroom on slug (slug)',
  })
  async findSlugMushroomCmd(searchText) {
    console.log(await this.findSlugMushroom(searchText));
  }

  async createMushroom(mushroom): Promise<MushroomItem> {
    // console.log(mushroom);

    if (Object.keys(mushroom).length === 0) {
      throw new HttpException(
        `You must send mushroom data.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const newMushroom = new MushroomItem();
      const newMushroomDescription = new MushroomDescription();

      newMushroomDescription.occurrence = mushroom.description.occurrence;
      newMushroomDescription.dimensions = mushroom.description.dimensions;
      newMushroomDescription.cap = mushroom.description.cap;
      newMushroomDescription.underCap = mushroom.description.underCap;
      newMushroomDescription.capImprint = mushroom.description.capImprint;
      newMushroomDescription.stem = mushroom.description.stem;
      newMushroomDescription.flesh = mushroom.description.flesh;
      newMushroomDescription.characteristics =
        mushroom.description.characteristics;
      newMushroomDescription.possibleConfusion =
        mushroom.description.possibleConfusion;
      newMushroomDescription.comments = mushroom.description.comments;
      newMushroomDescription.value = mushroom.description.value;
      newMushroomDescription.frequency = mushroom.description.frequency;

      await newMushroomDescription.save();

      newMushroom.polishName = mushroom.polishName;
      newMushroom.slug = slugify(mushroom.polishName, slugifyConfig);
      newMushroom.scientificName = mushroom.scientificName;
      newMushroom.anotherNames = mushroom.anotherNames;
      newMushroom.application = mushroom.application;
      newMushroom.isLegallyProtected = mushroom.isLegallyProtected;
      newMushroom.approvedForTrade = mushroom.approvedForTrade;
      newMushroom.dataSources = mushroom.dataSources;

      await newMushroom.save();

      newMushroom.description = newMushroomDescription;
      await newMushroom.save();
      return newMushroom;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          `Polish or scientific name is already exist.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @Command({
    command:
      'add <polishName> <scientificName> <anotherNames> <application> <isLegallyProtected> <approvedForTrade> <occurrence> <dimensions> <cap> <underCap> <capImprint> <stem> <flesh> <characteristics> <possibleConfusion> <value> <comments> <frequency> <dataSources>',
    description: 'Add mushroom',
  })
  async addMushroomCmd(
    polishName,
    scientificName,
    anotherNames,
    application,
    isLegallyProtected,
    approvedForTrade,
    occurrence,
    dimensions,
    cap,
    underCap,
    capImprint,
    stem,
    flesh,
    characteristics,
    possibleConfusion,
    value,
    comments,
    frequency,
    dataSources,
  ) {
    console.log(
      await this.createMushroom({
        polishName,
        scientificName,
        anotherNames,
        application,
        isLegallyProtected: Boolean(isLegallyProtected),
        approvedForTrade: Boolean(approvedForTrade),
        description: {
          occurrence,
          dimensions,
          cap,
          underCap,
          capImprint,
          stem,
          flesh,
          characteristics,
          possibleConfusion,
          value,
          comments,
          frequency,
        },
        dataSources,
      }),
    );
  }

  async deleteMushroom(id) {
    const descriptionId = await MushroomItem.findOne({
      where: [{ id }],
      relations: ['description'],
    });

    if (!descriptionId) {
      throw new HttpException(
        `I can not find mushroom id ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await MushroomItem.delete(id);
    await MushroomDescription.delete({ id: descriptionId.description.id });

    const images = await Image.find({ mushroomId: id });
    // console.log(images);

    try {
      if (images.length > 0) {
        await Promise.all(
          images.map(async (v) => {
            await Image.delete(v);
            // await v.save();
            fs.unlinkSync(path.join(mushroomImagePath, v.imageName));
          }),
        );
      }
    } catch (e) {
      throw new HttpException(`No image found!`, HttpStatus.BAD_REQUEST);
    }
  }

  @Command({
    command: 'delete <id>',
    description: 'Delete mushroom',
  })
  async deleteMushroomsCmd(id) {
    console.log(await this.deleteMushroom(id));
  }

  async updateMushroom(id, updateMushroom) {
    const descriptionId = await MushroomItem.findOne({
      where: [{ id }],
      relations: ['description'],
    });
    // console.log(descriptionId);

    if (descriptionId == undefined) {
      throw new HttpException(
        `Mushroom ${id} not exist.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await MushroomDescription.update(
        descriptionId.description.id,
        updateMushroom.description,
      );
      updateMushroom.description = descriptionId.description.id;
      updateMushroom.slug = slugify(updateMushroom.polishName, slugifyConfig);
      return await MushroomItem.update(id, updateMushroom);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          `Polish or scientific name is already exist.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return err;
    }
  }

  @Command({
    command:
      'update <id> <polishName> <scientificName> <anotherNames> <application> <isLegallyProtected> <approvedForTrade> <occurrence> <dimensions> <cap> <underCap> <capImprint> <stem> <flesh> <characteristics> <possibleConfusion> <value> <comments> <frequency> <dataSources>',
    description: 'Add mushroom',
  })
  async updateMushroomCmd(
    id,
    polishName,
    scientificName,
    anotherNames,
    application,
    isLegallyProtected,
    approvedForTrade,
    occurrence,
    dimensions,
    cap,
    underCap,
    capImprint,
    stem,
    flesh,
    characteristics,
    possibleConfusion,
    value,
    comments,
    frequency,
    dataSources,
  ) {
    console.log(
      await this.updateMushroom(id, {
        polishName,
        scientificName,
        anotherNames,
        application,
        isLegallyProtected: Boolean(isLegallyProtected),
        approvedForTrade: Boolean(approvedForTrade),
        description: {
          occurrence,
          dimensions,
          cap,
          underCap,
          capImprint,
          stem,
          flesh,
          characteristics,
          possibleConfusion,
          value,
          comments,
          frequency,
        },
        dataSources,
      }),
    );
  }
}
