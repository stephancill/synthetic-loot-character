import style from "./Token.module.css"

export const Token = ({imageData}: {imageData: string}) => {
  return <div className={style.token}>
    <img alt="Synthetic Loot" src={imageData}></img>
  </div>
}