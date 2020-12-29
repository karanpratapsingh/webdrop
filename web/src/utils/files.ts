import { PeerInfo } from '../generated/types';

export enum FileTransferPayloadType {
  FILE_INFO = 'file-info',
  CHUNK_RECEIVED = 'chunk-received',
  PROGRESS = 'progress',
  TRANSFER_COMPLETE = 'transfer-complete'
}

export type FileInfo = {
  name: string;
  type: string;
  size: number;
};

export type SendFileInfoPayload = {
  type: FileTransferPayloadType.FILE_INFO;
  fileInfo: FileInfo;
};

export type SendChunkPayload = {
  type: FileTransferPayloadType.CHUNK_RECEIVED;
  chunkId: number;
  chunk: Blob;
  from: PeerInfo;
};

export type FileProgressPayload = {
  type: FileTransferPayloadType.PROGRESS;
  progress: number;
};

export type TransferCompletePayload = {
  type: FileTransferPayloadType.TRANSFER_COMPLETE;
  fileInfo: FileInfo;
};

export type FileTransferPayload =
  | SendFileInfoPayload
  | SendChunkPayload
  | FileProgressPayload
  | TransferCompletePayload;

export type ChunkPayload = {
  chunkId: number;
  chunk: Blob;
};

export type OnChunk = (chunkPayload: ChunkPayload) => void;

export type OnComplete = () => void;

export type OnProgress = (progress: number) => void;

export class FileChunker {
  private file: File;
  private chunkSize: number;
  private onChunk: OnChunk;
  private onProgress: OnProgress;
  private onComplete: OnComplete;

  constructor(file: File, onChunk: OnChunk, onProgress: OnProgress, onComplete: OnComplete) {
    this.chunkSize = 16 * 1024;
    this.file = file;
    this.onChunk = onChunk;
    this.onComplete = onComplete;
    this.onProgress = onProgress;
    this.start();
  }

  public start = (): void => {
    let chunkId: number = 0;

    for (let offset = 0; offset < this.file.size; offset += this.chunkSize) {
      this.onProgress(this.progress(offset));
      this.onChunk({ chunk: this.readChunk(offset), chunkId });
      chunkId++;
    }

    this.onProgress(100);
    this.onComplete();
  };

  private readChunk = (offset: number): Blob => {
    const chunk = this.file.slice(offset, offset + this.chunkSize);
    return chunk;
  };

  private progress(offset: number): number {
    return offset / this.file.size;
  }
}

export type DigestedFile = {
  file: File;
  url: string;
};

export class FileDigester {
  private chunks: Blob[];
  private fileInfo: FileInfo;

  constructor(chunks: Blob[], fileInfo: FileInfo) {
    this.chunks = chunks;
    this.fileInfo = fileInfo;
  }

  public digest = (): DigestedFile => {
    const file = new File(this.chunks, this.fileInfo.name);
    const url: string = URL.createObjectURL(file);
    return { file, url };
  };
}

export const getFileInfo = (file: File): FileInfo => {
  const { name, type, size } = file;
  return { name, type, size };
};
