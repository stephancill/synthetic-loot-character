import style from "./Punk.module.css"

export const Punk = ({imageData}: {imageData: string}) => {
  return <div className={style.punk}>
    <object data={imageData}></object>
  </div>
}