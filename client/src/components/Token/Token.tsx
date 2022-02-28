import style from "./Token.module.css"

export const Token = ({imageData}: {imageData: string}) => {
  return <div className={style.token}>
    <object data={imageData}></object>
  </div>
}