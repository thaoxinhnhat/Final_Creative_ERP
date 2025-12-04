"use client"

import { useState } from "react"
import { ArrowLeft, AlertCircle, CheckCircle, Info, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

const sampleText = `Amazing Puzzle Game - Brain Training and Fun Challenges

Discover the ultimate puzzle game experience! Our brain training app offers hundreds of challenging puzzles designed to improve your cognitive skills while having fun. Whether you're a puzzle enthusiast or just looking for a casual game to relax with, this is the perfect puzzle game for you.

Features:
- Over 500 unique puzzle challenges
- Daily brain training exercises
- Relaxing puzzle gameplay
- Offline game mode
- Free to play with optional in-app purchases

Download now and start your puzzle adventure! Train your brain with the best puzzle game available on the App Store and Google Play.`

const keywordAnalysis = [
  {
    keyword: "puzzle",
    count: 8,
    density: 3.8,
    status: "high",
    recommendation: "Keyword appears too frequently. Consider using synonyms.",
  },
  {
    keyword: "game",
    count: 5,
    density: 2.4,
    status: "optimal",
    recommendation: "Perfect density for this keyword.",
  },
  {
    keyword: "brain",
    count: 3,
    density: 1.4,
    status: "low",
    recommendation: "Consider adding 1-2 more mentions for better optimization.",
  },
  {
    keyword: "training",
    count: 2,
    density: 0.9,
    status: "low",
    recommendation: "Increase frequency to improve discoverability.",
  },
  {
    keyword: "challenge",
    count: 2,
    density: 0.9,
    status: "optimal",
    recommendation: "Good frequency for this keyword.",
  },
  {
    keyword: "fun",
    count: 2,
    density: 0.9,
    status: "optimal",
    recommendation: "Well balanced usage.",
  },
]

const suggestedKeywords = [
  { keyword: "brain teaser", popularity: "High", competition: "Medium" },
  { keyword: "logic game", popularity: "Medium", competition: "Low" },
  { keyword: "mind game", popularity: "High", competition: "High" },
  { keyword: "thinking game", popularity: "Medium", competition: "Medium" },
  { keyword: "IQ test", popularity: "High", competition: "High" },
]

export default function KeywordDensityPage() {
  const router = useRouter()
  const [text, setText] = useState(sampleText)
  const [highlightKeyword, setHighlightKeyword] = useState("")

  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text
    const regex = new RegExp(`(${keyword})`, "gi")
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 font-semibold rounded">$1</mark>')
  }

  const totalWords = text.split(/\s+/).filter((word) => word.length > 0).length
  const totalCharacters = text.length

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Text Input */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <Button variant="ghost" size="sm" onClick={() => router.push("/applications")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Keyword Density Analyzer</h1>
            <p className="text-sm text-gray-500">Analyze and optimize keyword usage in your metadata</p>
          </div>

          {/* Text Input Area */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata Text</CardTitle>
              <CardDescription>Paste your app title, subtitle, and description here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your app metadata text here..."
                rows={15}
                className="font-mono text-sm resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    <span className="font-semibold">{totalWords}</span> words
                  </span>
                  <span>•</span>
                  <span>
                    <span className="font-semibold">{totalCharacters}</span> characters
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Optimize
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Check Density
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Highlighted Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Highlighted Preview</CardTitle>
              <CardDescription>
                {highlightKeyword
                  ? `Showing occurrences of "${highlightKeyword}"`
                  : "Click a keyword below to highlight"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="text-sm leading-relaxed whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border min-h-[200px]"
                dangerouslySetInnerHTML={{ __html: highlightText(text, highlightKeyword) }}
              />
            </CardContent>
          </Card>

          {/* Density Table */}
          <Card>
            <CardHeader>
              <CardTitle>Keyword Density Analysis</CardTitle>
              <CardDescription>Click a keyword to highlight it in the text above</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Density</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywordAnalysis.map((item, index) => (
                    <TableRow
                      key={index}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setHighlightKeyword(item.keyword)}
                    >
                      <TableCell className="font-medium">{item.keyword}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {item.count}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={item.density * 10} className="w-20" />
                          <span className="text-sm font-medium">{item.density}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.status === "optimal" ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Optimal
                          </Badge>
                        ) : item.status === "low" ? (
                          <Badge className="bg-yellow-100 text-yellow-700">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Low
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            High
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{item.recommendation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Panel - Suggestions */}
      <div className="w-96 bg-white border-l border-gray-200 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Optimization Suggestions</h3>
            <p className="text-xs text-gray-500">Recommended keywords to improve ASO</p>
          </div>

          {/* Suggested Keywords to Add */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Suggested Keywords</CardTitle>
              <CardDescription>High-potential keywords to consider adding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suggestedKeywords.map((item, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{item.keyword}</p>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                        + Add
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline" className="text-xs">
                        {item.popularity} popularity
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.competition} competition
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optimization Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">Natural Keyword Usage</p>
                    <p className="text-xs text-blue-800">
                      Use keywords naturally in sentences. Avoid keyword stuffing.
                    </p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 mb-1">Optimal Density</p>
                    <p className="text-xs text-yellow-800">Aim for 1-3% density for primary keywords.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900 mb-1">Use Variations</p>
                    <p className="text-xs text-green-800">
                      Include keyword variations and synonyms for better coverage.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Optimize Text
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Save Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
