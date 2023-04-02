// import { StreamMediaType } from '#app/recording/recording.types';
// import { Injectable } from '@nestjs/common';
// import { Readable, finished } from 'node:stream';
// import { mkdtemp, rm } from 'node:fs/promises';
// import { tmpdir } from 'node:os';
// import path from 'node:path';
// import { createReadStream } from 'node:fs';
// import getFfmpegCommand, {
//   AudioVideoFilter,
// } from '#app/global/ffmpeg/ffmpeg.command';

// export type ConcatOptions = {
//   height: number;
//   fps: number;
// };

// @Injectable()
// export class FfmpegService {
//   #getVideoFilters(opts: ConcatOptions): AudioVideoFilter[] {
//     const w = `16/9*${opts.height}`;
//     const h = opts.height;

//     return [
//       {
//         filter: 'fps',
//         options: String(opts.fps),
//       },
//       {
//         filter: 'scale',
//         options: `${w}:${h}:force_original_aspect_ratio=decrease`,
//       },
//       {
//         filter: 'pad',
//         options: `${w}:${h}:-1:-1:color=black`,
//       },
//       {
//         filter: 'setsar',
//         options: '1',
//       },
//       {
//         filter: 'settb',
//         options: 'AVTB',
//       },
//       {
//         filter: 'setpts',
//         options: 'PTS-STARTPTS',
//       },
//       {
//         filter: 'format',
//         options: 'yuv420p',
//       },
//     ];
//   }

//   #getAudioFilters(_: ConcatOptions): AudioVideoFilter[] {
//     return [
//       {
//         filter: 'aformat',
//         options: 'sample_rates=48000:channel_layouts=stereo',
//       },
//       {
//         filter: 'asettb',
//         options: 'AVTB',
//       },
//       {
//         filter: 'asetpts',
//         options: 'PTS-STARTPTS',
//       },
//     ];
//   }

//   async #convertChunkStream(
//     tmpDir: string,
//     chunk: ChunkStream,
//     type: StreamMediaType,
//     opts: ConcatOptions,
//   ): Promise<string> {
//     const outFilename = `${chunk.name}.ts`;
//     const input = await chunk.stream();
//     const command = getFfmpegCommand(input);

//     /**
//      * Add silent audio input so we can concat videos without audio stream
//      * @see https://trac.ffmpeg.org/wiki/Null#anullsrc
//      */
//     if (type === StreamMediaType.SCREEN) {
//       command.input('anullsrc=r=48000:cl=mono').inputFormat('lavfi');
//     }

//     command.output(path.join(tmpDir, outFilename)).format('mpegts');

//     if ([StreamMediaType.CAMERA, StreamMediaType.SCREEN].includes(type)) {
//       command
//         .videoCodec('libx264')
//         .videoFilters(this.#getVideoFilters(opts))
//         .outputOption('-bsf:v h264_mp4toannexb');
//     }

//     if ([StreamMediaType.SCREEN, StreamMediaType.MICROPHONE].includes(type)) {
//       command.audioCodec('aac').audioFilters(this.#getAudioFilters(opts));
//     }

//     return new Promise((resolve, reject) => {
//       command
//         .outputOption('-shortest')
//         .on('end', () => resolve(outFilename))
//         .on('error', reject)
//         .run();
//     });
//   }

//   async #getConcatenatedOutputStream(
//     tmpDir: string,
//     inputs: string[],
//     type: StreamMediaType,
//     opts: ConcatOptions,
//   ): Promise<Readable> {
//     const format = type === StreamMediaType.MICROPHONE ? 'm4a' : 'mp4';
//     const outPath = path.join(tmpDir, `out.${format}`);
//     const input = `concat:${inputs.join('|')}`;
//     const command = getFfmpegCommand(input, { cwd: tmpDir }).inputFormat(
//       'mpegts',
//     );
//     const copyOption = {
//       [StreamMediaType.MICROPHONE]: '-c:a',
//       [StreamMediaType.CAMERA]: '-c:v',
//       [StreamMediaType.SCREEN]: '-c',
//     };

//     command.input(this.#generateMetadata());

//     command
//       .output(outPath)
//       .outputOption(copyOption[type], 'copy')
//       .outputOption('-map_metadata 1')
//       .outputOption('-movflags faststart');

//     if ([StreamMediaType.SCREEN, StreamMediaType.MICROPHONE].includes(type)) {
//       command.outputOption('-bsf:a aac_adtstoasc');
//     }

//     return new Promise((resolve, reject) => {
//       command
//         .on('end', () => resolve(createReadStream(outPath)))
//         .on('error', reject)
//         .run();
//     });
//   }

//   async concatChunks(
//     type: StreamMediaType,
//     chunks: ChunkStream[],
//     opts: ConcatOptions = {
//       height: 720,
//       fps: 25,
//     },
//   ): Promise<Readable> {
//     const tmpDir = await mkdtemp(path.join(tmpdir(), 'ffmpeg-'));
//     const rmTmpDir = () =>
//       rm(tmpDir, { recursive: true, force: true }).catch(() => {});

//     try {
//       const inputs: string[] = [];

//       for (const chunk of chunks) {
//         inputs.push(await this.#convertChunkStream(tmpDir, chunk, type, opts));
//       }

//       const rs = await this.#getConcatenatedOutputStream(
//         tmpDir,
//         inputs,
//         type,
//         opts,
//       );

//       // Remove temporary directory after stream is finished
//       const cleanup = finished(rs, () => {
//         rmTmpDir().then(() => {
//           cleanup();
//           rs.destroy();
//         });
//       });

//       return rs;
//     } catch (err) {
//       await rmTmpDir();

//       throw err;
//     }
//   }
// }
