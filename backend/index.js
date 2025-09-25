import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.post("/analyze", (req, res) => {
  const { resumeText } = req.body

  if (!resumeText) {
    return res.status(400).json({ error: "Resume text is required" })
  }

  // Fake logic for analysis
  const requiredSections = ["Objective", "Skills", "Experience", "Education", "Projects"]
  const foundSections = {}

  requiredSections.forEach(section => {
    foundSections[section] = resumeText.toLowerCase().includes(section.toLowerCase())
  })

  const keywords = ["JavaScript", "React", "Node.js", "MongoDB", "Git", "API", "Tailwind"]
  const foundKeywords = keywords.filter(keyword =>
    resumeText.toLowerCase().includes(keyword.toLowerCase())
  )

  const fakeScore = Math.floor(Math.random() * 21) + 80 // random score between 80–100

  const fakeSuggestions = [
    "Add a summary section at the top",
    "Include links to LinkedIn/GitHub",
    "Mention achievements in bullet points",
    "Use consistent formatting across sections",
    "Quantify your impact in experience section"
  ]

  res.json({
    score: fakeScore,
    sections: foundSections,
    keywordsFound: foundKeywords,
    suggestions: fakeSuggestions.slice(0, 3) // pick first 3
  })
})

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`)
})
