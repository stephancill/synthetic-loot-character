import { ReactElement, useState } from "react"
import deployments from "../../deployments.json"

interface ISection {
  heading: string
  body: ReactElement
}

export const Copy = () => {
  const sections: ISection[] = [
    {
      heading: "What is Synthetic Loot?",
      body: (
        <p>
          <b>Synthetic Loot</b> is a loot bag associated with each ethereum address. For more information about the Loot
          Project see{" "}
          <a href="https://www.lootproject.com/" target="_blank" rel="noopener noreferrer">
            lootproject.com
          </a>
          . For more information about Synthetic Loot, see the{" "}
          <a href="https://www.lootproject.com/synthloot" target="_blank" rel="noopener noreferrer">
            Synthetic Loot FAQ
          </a>{" "}
          page.
        </p>
      ),
    },
    {
      heading: "What is a Synthetic Loot Character?",
      body: (
        <p>
          Synthetic Loot Character is a visual representation of an address' Synthetic Loot. It generates a unique,
          fully on-chain character for each Ethereum address.
        </p>
      ),
    },
  ]

  const [expanded, setExpanded] = useState<boolean[]>([...new Array(sections.length)].fill(false))

  return (
    <div style={{ width: "90%", maxWidth: "400px", marginBottom: "80px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ padding: "5px" }}>FAQ</h1>
      </div>

      {sections.map((section, index) => {
        return (
          <div
            key={index}
            style={{ marginBottom: "20px", backgroundColor: "var(--lighter)", padding: "30px", borderRadius: "5px" }}
          >
            <div
              style={{ display: "flex", margin: "-20px", padding: "20px", cursor: "pointer" }}
              onClick={() => {
                const expandedCopy = [...expanded]
                expandedCopy[index] = !expandedCopy[index]
                setExpanded(expandedCopy)
              }}
            >
              <h1 style={{ display: "inline-block", fontWeight: "normal" }}>{section.heading}</h1>
              <h1 style={{ marginLeft: "auto", display: "inline-block" }}>{expanded[index] ? "–" : "+"}</h1>
            </div>
            {expanded[index] && <div style={{ marginTop: "20px" }}>{section.body}</div>}
          </div>
        )
      })}
    </div>
  )
}
