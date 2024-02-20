import type { Schema, Plugin, PDFRenderProps, UIRenderProps } from '@pdfme/common';
import { rotatePoint, convertForPdfLayoutProps, hex2RgbColor } from '../utils.js';
import { HEX_COLOR_PATTERN } from '../constants.js';

const DEFAULT_LINE_COLOR = '#800080';

interface LineSchema extends Schema {
  color: string;
}

const lineSchema: Plugin<LineSchema> = {
  pdf: (arg: PDFRenderProps<LineSchema>) => {
    const { page, schema } = arg;
    const pageHeight = page.getHeight();
    const {
      width,
      height,
      rotate,
      position:{x , y},
      
      startPosition: {x1, y1},
      
      endPosition:{x2,y2},
      opacity,
    } = convertForPdfLayoutProps({ schema, pageHeight, applyRotateTranslate: false });
    const pivot = { x: x, y: y };
    page.drawLine({
      start: {x:x1,y:y1},
      end: {x:x2,y:y2},
      thickness: height,
      color: hex2RgbColor(DEFAULT_LINE_COLOR),
      opacity: opacity,
    });
  },
  ui: (arg: UIRenderProps<LineSchema>) => {
    const { schema, rootElement } = arg;
    const div = document.createElement('div');
    div.style.backgroundColor = schema.color ?? DEFAULT_LINE_COLOR;
    div.style.width = '100%';
    div.style.height = '100%';
    rootElement.appendChild(div);
  },
  propPanel: {
    schema: ({ i18n }) => ({
      color: {
        title: i18n('schemas.color'),
        type: 'string',
        widget: 'color',
        required: true,
        rules: [
          {
            pattern: HEX_COLOR_PATTERN,
            message: i18n('hexColorPrompt'),
          },
        ],
      },
    }),
    defaultValue: '',
    defaultSchema: {
      type: 'line',
      position: { x: 0, y: 0 },
      startPosition:{x1:0,y1:0},
      endPosition:{x2:5,y2:5},
      width: 5,
      height: 1,
      rotate: 0,
      opacity: 1,
      readOnly: true,
      color: DEFAULT_LINE_COLOR,
    },
  },
};
export default lineSchema;
