import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgxExtendedPdfViewerComponent,
  pdfDefaultOptions,
} from 'ngx-extended-pdf-viewer';
import { CustomDragDropComponent } from './custom-drag-drop/custom-drag-drop.component';
import { DragDropConfig, PdfFile } from './custom-drag-drop/drag-drop-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('draggable1', { static: true })
  public draggable1!: CustomDragDropComponent;
  @ViewChild('draggable2', { static: true })
  public draggable2!: CustomDragDropComponent;
  @ViewChild('pdfViewer', { static: true })
  pdf!: NgxExtendedPdfViewerComponent;
  public listPdf: PdfFile[] = [
    {
      name: '/assets/PTIT14082023.pdf',
      src: '/assets/BBNT.pdf',
      dragDrops: [
        {
          id: 'a',
          positionX: 10,
          positionY: 10,
          width: 200,
          height: 100,
          page: 1,
          fontSize: (7 * 4) / 3,
          text: [
            {
              key: 'CommonName',
              label: 'Ký bởi',
              value: 'Đoàn Bình Khánh',
            },
            {
              key: 'Email',
              label: 'Email',
              value: 'binhkhanh2204@gmail.com',
            },
            {
              key: 'Organization',
              label: 'Đơn vị',
              value: 'Security_Blockchain',
            },
            {
              key: 'Time',
              label: 'Thời gian',
              value: '31/08/2023 16:00',
            },
          ],
          pageHeight: 1,
          pageWidth: 1,
        },
        {
          id: 'c',
          positionX: 300,
          positionY: 300,
          width: 100,
          height: 200,
          page: 1,
          fontSize: (7 * 4) / 3,
          text: [
            {
              key: 'CommonName',
              label: 'Ký bởi',
              value: 'Đoàn Bình Khánh',
            },
            {
              key: 'Email',
              label: 'Email',
              value: 'binhkhanh2204@gmail.com',
            },
            {
              key: 'Organization',
              label: 'Đơn vị',
              value: 'Security_Blockchain',
            },
            {
              key: 'Time',
              label: 'Thời gian',
              value: '31/08/2023 16:00',
            },
          ],
          pageHeight: 1,
          pageWidth: 1,
        },
        {
          id: 'd',
          positionX: 50,
          positionY: 50,
          width: 100,
          height: 100,
          page: 2,
          fontSize: (7 * 4) / 3,
          text: [
            {
              key: 'CommonName',
              label: 'Ký bởi',
              value: 'Đoàn Bình Khánh',
            },
            {
              key: 'Email',
              label: 'Email',
              value: 'binhkhanh2204@gmail.com',
            },
            {
              key: 'Organization',
              label: 'Đơn vị',
              value: 'Security_Blockchain',
            },
            {
              key: 'Time',
              label: 'Thời gian',
              value: '31/08/2023 16:00',
            },
          ],
          pageHeight: 1,
          pageWidth: 1,
        },
      ],
    },
    {
      name: '/assets/Nguyễn Tiến Hải Ninh T2.pdf',
      src: '/assets/Nguyễn Tiến Hải Ninh T2.pdf',
      dragDrops: [
        {
          id: 'b',
          positionX: 500,
          positionY: 500,
          width: 150,
          height: 100,
          page: 1,
          fontSize: (7 * 4) / 3,
          text: [
            {
              key: 'CommonName',
              label: 'Ký bởi',
              value: 'Đoàn Bình Khánh',
            },
            {
              key: 'Email',
              label: 'Email',
              value: 'binhkhanh2204@gmail.com',
            },
            {
              key: 'Organization',
              label: 'Đơn vị',
              value: 'Security_Blockchain',
            },
            {
              key: 'Time',
              label: 'Thời gian',
              value: '31/08/2023 16:00',
            },
          ],
          pageHeight: 1,
          pageWidth: 1,
        },
        {
          id: 'e',
          positionX: 100,
          positionY: 100,
          width: 100,
          height: 100,
          page: 2,
          fontSize: (7 * 4) / 3,
          text: [
            {
              key: 'CommonName',
              label: 'Ký bởi',
              value: 'Đoàn Bình Khánh',
            },
            {
              key: 'Email',
              label: 'Email',
              value: 'binhkhanh2204@gmail.com',
            },
            {
              key: 'Organization',
              label: 'Đơn vị',
              value: 'Security_Blockchain',
            },
            {
              key: 'Time',
              label: 'Thời gian',
              value: '31/08/2023 16:00',
            },
          ],
          pageHeight: 1,
          pageWidth: 1,
        },
      ],
    },
  ];
  public selected = this.listPdf[0];
  public config1: DragDropConfig = {
    maxWidth: 400,
    minWidth: 100,
    maxHeight: 200,
    minHeight: 50,
    defaultWidth: 200,
    defaultHeight: 100,
    defaultFontSize: 7 * (4 / 3),
    zoom: 1,
    image: '/assets/signature.png',
  };

  public config2: DragDropConfig = {
    maxWidth: 400,
    minWidth: 100,
    maxHeight: 200,
    minHeight: 50,
    defaultWidth: 200,
    defaultHeight: 100,
    defaultFontSize: 7 * (4 / 3),
    zoom: 1,
    image: '',
  };

  public zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  constructor() {
    pdfDefaultOptions.doubleTapZoomFactor = '';
  }

  ngOnInit(): void {
    this.draggable1.onDataChange.subscribe(() => {
      this.selected.dragDrops = this.draggable1.listItem;
      console.log(this.selected);
    });
    this.pdf.pageRendered.subscribe((val) => {
      const canvas = val.source.canvas as HTMLCanvasElement;
    });

    // this.draggable2.onDataChange.subscribe(() => {
    //   this.selected.dragDrops = this.draggable2.listItem;
    // });
  }

  upload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files!;
    for (let i = 0; i < files?.length; i++) {
      const file = files.item(i)!;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.listPdf.push({
          name: file.name,
          src: reader.result!,
          dragDrops: [],
        });
      };
    }
  }

  del(i: number) {
    if (this.listPdf.length == 1)
      this.selected = { src: '', name: '', dragDrops: [] };
    else if (i == 0) this.selected = this.listPdf[1];
    else this.selected = this.listPdf[i - 1];
    this.listPdf.splice(i, 1);
  }
}
