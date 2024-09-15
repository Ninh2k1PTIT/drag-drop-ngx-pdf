export interface DragDropConfig {
  maxWidth: number;
  minWidth: number;
  maxHeight: number;
  minHeight: number;
  defaultWidth: number;
  defaultHeight: number;
  defaultFontSize: number;
  zoom: number;
  image: string;
}

export interface DragDropItem {
  id: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  page: number;
  pageWidth: number;
  pageHeight: number;
  canRemoved?: boolean;
  canEdited?: boolean;
  text?: DisplayContent[];
  fontSize?: number;
  fontFamily?: string;
  image?: string;
  [key: string]: any;
}

export interface DisplayContent {
  label: string;
  key: string;
  value: string | number | Date;
}

export interface PdfFile {
  name: string;
  src: string | ArrayBuffer;
  dragDrops: DragDropItem[];
}
