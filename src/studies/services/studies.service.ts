import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudiesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createStudyInput: Prisma.StudyCreateInput) {
    return this.prisma.study.create({
      data: createStudyInput,
    });
  }

  async findAll() {
    const all = await this.prisma.study.findMany({});

    console.log(all);
    return all;
  }

  findOne(id: number) {
    return this.prisma.study.findUnique({
      where: { id },
    });
  }

  update(id: number, updateStudyInput: Prisma.StudyUpdateInput) {
    return this.prisma.study.update({
      where: { id },
      data: updateStudyInput,
    });
  }

  remove(id: number) {
    return this.prisma.study.delete({
      where: { id },
    });
  }
}
