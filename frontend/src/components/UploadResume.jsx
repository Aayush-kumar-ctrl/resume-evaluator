
import { useState } from "react"
import * as pdfjsLib from "pdfjs-dist"

// Set workerSrc for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js"

const UploadResume = () => {
  const [file, setFile] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setFeedback("")
  }

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      let fullText = ""
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item) => item.str).join(" ")
        fullText += pageText + "\n"
      }

      return fullText
    } catch (err) {
      console.error("❌ PDF read error:", err)
      throw new Error("Failed to read your PDF.")
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a PDF.")
      return
    }

    setLoading(true)
    setFeedback("")

    try {
      const extractedText = await extractTextFromPDF(file)
      console.log("📄 Extracted text:", extractedText.slice(0, 200))

      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText: extractedText }),
      })

      const result = await response.json()

      const displayFeedback = `
✅ Resume Score: ${result.score}/100

📌 Sections Found:
${Object.entries(result.sections).map(([section, found]) => `- ${section}: ${found ? "✅" : "❌"}`).join("\n")}

🔍 Keywords Found:
${result.keywordsFound.join(", ") || "None"}

💡 Suggestions:
${result.suggestions.map((s) => `- ${s}`).join("\n")}
      `
      setFeedback(displayFeedback)
    } catch (err) {
      console.error(err)
      setFeedback("⚠️ Failed to analyze your resume. Try a different file.")
    }

    setLoading(false)
  }

  return (
    <div className="bg-white shadow-2xl rounded-lg p-8 w-[450px] text-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">AI Resume Evaluator</h2>
      <p className="text-sm text-gray-500">Upload your resume (PDF only)</p>

      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf"
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {file && <p className="text-sm text-gray-700 mt-2">📄 Selected: {file.name}</p>}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className={`w-full mt-2 px-4 py-2 font-semibold rounded-md transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {feedback && (
        <div className="mt-6 text-left bg-gray-100 p-4 rounded-md max-h-[300px] overflow-y-auto">
          <h3 className="font-semibold text-lg mb-2">AI Feedback:</h3>
          <pre className="text-sm whitespace-pre-wrap">{feedback}</pre>
        </div>
      )}
    </div>
  )
}

export default UploadResume
