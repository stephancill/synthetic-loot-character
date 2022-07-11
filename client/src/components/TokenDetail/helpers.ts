import assets from "../../../../backend/lib/image-data.json"

const itemSize = 50

export interface ICharacter {
  weapon: number
  chest: number
  head: number
  waist: number
  foot: number
  hand: number
  neck: number
  ring: number
}

export function getImageData(character: ICharacter) {
  const svg = [
    '<svg viewBox="0 0 50 50" width="1000" xmlns="http://www.w3.org/2000/svg">',
    getDefs(),
    getCharacter(character),
    "</svg>",
  ].join("")

  const output = `data:image/svg+xml;base64,${btoa(svg)}`

  return output
}

function getSpritesheetElement(_id: string, _imageData: string) {
  return [
    '<svg width="50" height="50" viewBox="100 0 50 50"><image id="',
    _id,
    '" preserveAspectRatio="xMinYMin slice" href="',
    _imageData,
    '" /></svg>',
  ].join("")
}

function getDefs() {
  return ["<defs>", getStyle(), "</defs>"].join("")
}

function getStyle() {
  return "<style> img { image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; image-rendering: pixelated; height: 50px;} svg { background : #1A1A1A; } </style>"
}

function getItemElement(_id: string, _spritesheetData: string) {
  return [
    '<svg width="50" height="50" viewBox="',
    _id,
    ' 0 50 50">',
    '<foreignObject width="10000" height="50">',
    '<img xmlns="http://www.w3.org/1999/xhtml" src="',
    _spritesheetData,
    '" />',
    "</foreignObject>",
    "</svg>",
  ].join("")
}

function getCharacter({ weapon, chest, head, waist, foot, hand, neck, ring }: ICharacter) {
  return [
    getItemElement("0", assets.skeleton),
    getItemElement(`${weapon * itemSize}`, assets.weapon),
    getItemElement(`${chest * itemSize}`, assets.chest),
    getItemElement(`${head * itemSize}`, assets.head),
    getItemElement(`${waist * itemSize}`, assets.waist),
    getItemElement(`${foot * itemSize}`, assets.foot),
    getItemElement(`${hand * itemSize}`, assets.hand),
    getItemElement(`${neck * itemSize}`, assets.neck),
    getItemElement(`${ring * itemSize}`, assets.ring),
  ].join("")
}
