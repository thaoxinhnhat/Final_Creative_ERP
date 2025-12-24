"use client"

import { useState } from "react"
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, MessageSquare, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const ratingData = [
  { month: "Jan", rating1: 45, rating2: 32, rating3: 78, rating4: 156, rating5: 289 },
  { month: "Feb", rating1: 38, rating2: 28, rating3: 65, rating4: 178, rating5: 312 },
  { month: "Mar", rating1: 42, rating2: 35, rating3: 82, rating4: 195, rating5: 346 },
  { month: "Apr", rating1: 35, rating2: 25, rating3: 70, rating4: 210, rating5: 380 },
  { month: "May", rating1: 30, rating2: 22, rating3: 62, rating4: 225, rating5: 411 },
  { month: "Jun", rating1: 28, rating2: 20, rating3: 55, rating4: 238, rating5: 439 },
]

const reviewsData = [
  {
    id: 1,
    user: "John D.",
    rating: 5,
    country: "US",
    date: "2024-09-28",
    title: "Amazing app!",
    comment: "This is the best app I've ever used. Highly recommend it to everyone!",
    sentiment: "positive",
    helpful: 24,
  },
  {
    id: 2,
    user: "Sarah M.",
    rating: 4,
    country: "UK",
    date: "2024-09-27",
    title: "Great but needs improvement",
    comment: "Overall great experience, but the loading time could be faster.",
    sentiment: "positive",
    helpful: 15,
  },
  {
    id: 3,
    user: "Mike K.",
    rating: 2,
    country: "CA",
    date: "2024-09-26",
    title: "Disappointed",
    comment: "The app crashes frequently. Needs serious bug fixes.",
    sentiment: "negative",
    helpful: 8,
  },
  {
    id: 4,
    user: "Emily R.",
    rating: 5,
    country: "AU",
    date: "2024-09-25",
    title: "Perfect!",
    comment: "Everything works smoothly. Love all the features!",
    sentiment: "positive",
    helpful: 32,
  },
  {
    id: 5,
    user: "David L.",
    rating: 3,
    country: "DE",
    date: "2024-09-24",
    title: "Decent",
    comment: "It's okay, nothing special. Could use more features.",
    sentiment: "neutral",
    helpful: 6,
  },
]

export default function AppReviewsPage() {
  const router = useRouter()
  const [countryFilter, setCountryFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const averageRating = 4.3
  const totalReviews = 12847
  const positivePercent = 78
  const negativePercent = 12

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/applications")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">App Reviews & Ratings</h1>
            <p className="text-sm text-gray-500">Theo dõi và phân tích đánh giá ứng dụng</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{totalReviews.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+234 this week</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Positive</p>
                <p className="text-3xl font-bold text-green-600">{positivePercent}%</p>
                <p className="text-xs text-gray-500 mt-1">4-5 star ratings</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ThumbsUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Negative</p>
                <p className="text-3xl font-bold text-red-600">{negativePercent}%</p>
                <p className="text-xs text-gray-500 mt-1">1-2 star ratings</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <ThumbsDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution Over Time</CardTitle>
            <CardDescription>Monthly breakdown of ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rating5" stackId="a" fill="#22c55e" name="5 Stars" />
                <Bar dataKey="rating4" stackId="a" fill="#84cc16" name="4 Stars" />
                <Bar dataKey="rating3" stackId="a" fill="#eab308" name="3 Stars" />
                <Bar dataKey="rating2" stackId="a" fill="#f97316" name="2 Stars" />
                <Bar dataKey="rating1" stackId="a" fill="#ef4444" name="1 Star" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
            <CardDescription>Positive vs Negative sentiment over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={[
                  { month: "Jan", positive: 75, negative: 15 },
                  { month: "Feb", positive: 76, negative: 14 },
                  { month: "Mar", positive: 77, negative: 13 },
                  { month: "Apr", positive: 78, negative: 12 },
                  { month: "May", positive: 77, negative: 13 },
                  { month: "Jun", positive: 78, negative: 12 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} name="Positive %" />
                <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} name="Negative %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest user feedback and ratings</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="us">US</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                  <SelectItem value="ca">CA</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviewsData.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="font-semibold text-blue-600">{review.user.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.user}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{review.date}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <Badge variant="outline" className="text-xs">
                          {review.country}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      review.sentiment === "positive"
                        ? "bg-green-100 text-green-700"
                        : review.sentiment === "negative"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                    }
                  >
                    {review.sentiment}
                  </Badge>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{review.helpful} found this helpful</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
