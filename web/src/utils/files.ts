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
  from: PeerInfo;
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
  from: PeerInfo;
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
  }

  public start = (): void => {
    let chunkId: number = 0;
    let lastProgress: number = 0;

    for (let offset = 0; offset < this.file.size; offset += this.chunkSize) {
      const progress: number = this.progress(offset);

      if (progress - lastProgress > 5) {
        this.onProgress(progress);
      }
      lastProgress = progress;
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
    return Math.round((offset / this.file.size) * 100);
  }
}

export class FileDigester {
  private chunks: Blob[];
  private fileInfo: FileInfo;

  constructor(chunks: Blob[], fileInfo: FileInfo) {
    this.chunks = chunks;
    this.fileInfo = fileInfo;
  }

  public digest = (): File => {
    const file = new File(this.chunks, this.fileInfo.name);
    return file;
  };
}

export const getFileInfo = (file: File): FileInfo => {
  const { name, type, size } = file;
  return { name, type, size };
};
