"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import {
  ExternalLink,
  ArrowRight,
  AlertTriangle,
  Clock,
  Plus,
  Eye,
  GitCompare,
  Download,
  Calendar,
  User,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Check,
  Archive,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react"

export default function TasksCollabPage() {
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  const redirectUrl = "" // URL sẽ được cập nhật sau

  const handleRedirect = () => {
    if (redirectUrl) {
      window.open(redirectUrl, "_blank")
    }
  }

  const mockAssetRequests = [
    {
      id: "ASO-001",
      appName: "Meditation Pro",
      platform: "iOS",
      projectId: "1",
      projectName: "Meditation Pro - Winter 2025",
      projectDeadline: "2024-12-20", // Deadline từ Project (test vấn đề 6/)
      campaignId: "Winter-2025", // Campaign sync (test vấn đề 5/)
      assetType: "Screenshot Set (5 screens)",
      requester: "Minh An",
      designer: "Designer A",
      status: "in-design",
      progress: 70,
      createdDate: "2024-12-08",
      deadline: "2024-12-20",
      daysLeft: 9,
      isUrgent: false,
      hasProjectDeadline: true, // Có deadline từ Project
    },
    {
      id: "ASO-002",
      appName: "Sleep Sounds",
      platform: "Android",
      projectId: "2",
      projectName: "Sleep Sounds - Spring Campaign",
      projectDeadline: "2024-12-15", // Deadline gần
      campaignId: "Spring-2025",
      assetType: "App Icon + Feature Graphic",
      requester: "Hoang Nam",
      designer: "Designer B",
      status: "need-revision",
      progress: 50,
      createdDate: "2024-12-06",
      deadline: "2024-12-15",
      daysLeft: 4,
      isUrgent: true, // Gần deadline
      hasProjectDeadline: true,
      revisionNote: "Icon color needs adjustment",
    },
    {
      id: "ASO-003",
      appName: "Focus Timer",
      platform: "iOS",
      projectId: "4",
      projectName: "Focus Timer - Summer Launch",
      projectDeadline: "2024-12-25",
      campaignId: "Summer-2025",
      assetType: "Promo Video + Screenshots",
      requester: "Tran Van C",
      designer: "Designer C",
      status: "approved",
      progress: 100,
      createdDate: "2024-12-01",
      deadline: "2024-12-25",
      daysLeft: 14,
      isUrgent: false,
      hasProjectDeadline: true,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-design":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">In Design</Badge>
      case "need-revision":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Need Revision</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
      case "pending":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDeadlineColor = (daysLeft: number) => {
    if (daysLeft <= 2) return "text-red-600"
    if (daysLeft <= 5) return "text-orange-600"
    return "text-green-600"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* PHẦN I: Asset Request Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Asset Production Center</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {mockAssetRequests.length} Active Orders
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  {mockAssetRequests.filter((r) => r.status === "in-design").length} In Review
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {mockAssetRequests.filter((r) => r.status === "approved").length} Approved
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {mockAssetRequests.filter((r) => r.isUrgent).length} Urgent
                </span>
              </div>
            </div>
            <Button onClick={() => setShowNewRequestForm(!showNewRequestForm)}>
              <Plus className="h-4 w-4 mr-2" />
              New Asset Request
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockAssetRequests.map((request) => (
            <div
              key={request.id}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                request.isUrgent ? "border-red-300 bg-red-50/30" : "border-gray-200"
              }`}
            >
              {/* Urgent Alert Banner */}
              {request.isUrgent && (
                <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-800">
                    URGENT: Deadline approaching in {request.daysLeft} days!
                  </span>
                </div>
              )}

              {/* Project Deadline Info */}
              {request.hasProjectDeadline && (
                <div className="mb-3 p-2 bg-purple-50 border border-purple-200 rounded flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <div className="flex-1">
                    <span className="text-sm text-purple-900">
                      <strong>Project Deadline:</strong> {request.projectDeadline}
                    </span>
                    <span className="text-xs text-purple-700 ml-2">(Campaign: {request.campaignId})</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-purple-300 bg-transparent"
                    onClick={() => window.open(`/applications/aso-dashboard/${request.projectId}`, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Project
                  </Button>
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">Order #{request.id}</h3>
                    {getStatusBadge(request.status)}
                    {request.campaignId && (
                      <Badge variant="outline" className="text-xs">
                        {request.campaignId}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">App:</span>
                      <span className="ml-2 font-medium">
                        {request.appName} - {request.platform}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 font-medium">{request.assetType}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Project:</span>
                      <button
                        className="ml-2 font-medium text-blue-600 hover:underline"
                        onClick={() => window.open(`/applications/aso-dashboard/${request.projectId}`, "_blank")}
                      >
                        #{request.projectId} {request.projectName}
                      </button>
                    </div>
                    <div>
                      <span className="text-gray-500">Requester:</span>
                      <span className="ml-2 font-medium">{request.requester}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Designer:</span>
                      <span className="ml-2 font-medium">{request.designer}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2">{request.createdDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Deadline:</span>
                      <span className={`ml-2 font-medium ${getDeadlineColor(request.daysLeft)}`}>
                        {request.deadline} ({request.daysLeft} days left)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{request.progress}%</span>
                </div>
                <Progress value={request.progress} className="h-2" />
              </div>
              {request.revisionNote && (
                <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Note: {request.revisionNote}
                </div>
              )}

              {/* Preview thumbnails */}
              {request.status === "in-design" && (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Preview:</div>
                  <div className="flex gap-2">
                    <div className="w-20 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded border border-gray-200"></div>
                    <div className="w-20 h-32 bg-gradient-to-br from-blue-400 to-teal-500 rounded border border-gray-200"></div>
                    <div className="w-20 h-32 bg-gradient-to-br from-teal-400 to-green-500 rounded border border-gray-200"></div>
                    <div className="w-20 h-32 bg-gray-100 rounded border border-gray-300 border-dashed flex items-center justify-center text-gray-400 text-xs">
                      Pending
                    </div>
                    <div className="w-20 h-32 bg-gray-100 rounded border border-gray-300 border-dashed flex items-center justify-center text-gray-400 text-xs">
                      Pending
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-purple-900 space-y-2">
              <p className="font-semibold">Asset Production - Project Deadline Tracking (Vấn đề 6/):</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>Project Deadline</strong>: Mỗi asset request tự động nhận deadline từ Project khi được gửi từ
                  StoreKit Management
                </li>
                <li>
                  <strong>Campaign ID</strong>: Asset request được gắn Campaign ID để đồng bộ với Metadata và StoreKit
                  (test vấn đề 5/)
                </li>
                <li>
                  <strong>Urgent Alert</strong>: Designer nhận cảnh báo khi còn 5 days trước deadline
                </li>
                <li>
                  <strong>Critical Alert</strong>: Banner đỏ hiển thị khi còn 2 days trước deadline
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PHẦN II: Create Asset Request Form */}
      {showNewRequestForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Asset Request</CardTitle>
            <CardDescription>Fill in the details for your asset production request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Request Details */}
            <div className="space-y-4">
              <div>
                <Label>Project</Label>
                <Input value="Meditation Pro - v3.1" readOnly className="mt-1" />
              </div>

              <div>
                <Label className="mb-2 block">Asset Type</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="icon" checked />
                    <label htmlFor="icon" className="text-sm font-medium">
                      App Icon
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="screenshots" checked />
                    <label htmlFor="screenshots" className="text-sm font-medium">
                      Screenshots (specify): <span className="text-gray-600 font-normal">5 screens</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="feature" />
                    <label htmlFor="feature" className="text-sm font-medium">
                      Feature Graphic
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="video" />
                    <label htmlFor="video" className="text-sm font-medium">
                      Promo Video
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Priority</Label>
                <RadioGroup defaultValue="normal">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <label htmlFor="low" className="text-sm">
                      Low (7 days)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <label htmlFor="normal" className="text-sm">
                      Normal (5 days)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="urgent" />
                    <label htmlFor="urgent" className="text-sm">
                      Urgent (2 days)
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Deadline</Label>
                <Input type="date" value="2024-12-15" className="mt-1" />
              </div>
            </div>

            {/* Brief Section */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label>Design Brief</Label>
                <Textarea
                  className="mt-1 min-h-[120px]"
                  value="Need calming, peaceful design with purple/blue gradient theme.
Target audience: 25-45 years, professionals seeking stress relief.
Include elements: meditation poses, nature backgrounds, soft colors."
                  readOnly
                />
              </div>

              <div>
                <Label>Brand Guidelines</Label>
                <div className="mt-1 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 text-sm">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <span className="text-blue-600">brand_guide.pdf</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Reference Materials</Label>
                <div className="mt-1 space-y-2">
                  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-2 text-sm">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <span className="text-blue-600">competitor_calm.jpg</span>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-2 text-sm">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <span className="text-blue-600">mood_board.png</span>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-2 text-sm">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <span className="text-blue-600">color_palette.png</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button>Submit Request</Button>
              <Button variant="outline" onClick={() => setShowNewRequestForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PHẦN III: Simple Asset Viewer - Removed annotation toolbar and comparison view */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Review</CardTitle>
          <CardDescription>View and review design assets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Simple Image Viewer */}
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <div className="text-sm text-gray-600 mb-2">Screenshot 1 - Home Screen</div>
            <div className="relative w-full aspect-[9/16] max-w-sm mx-auto bg-gradient-to-br from-purple-400 via-blue-500 to-teal-400 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>

      {/* PHẦN IV: Feedback Thread System */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Thread</CardTitle>
          <CardDescription>Communication history for this asset</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comment 1 */}
          <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              DA
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">Designer A</span>
                <span className="text-xs text-gray-500">10:30 AM</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">First draft ready for review. Used gradient as requested.</p>
              <div className="flex items-center gap-2">
                <Paperclip className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-blue-600">draft_v1.png</span>
              </div>
            </div>
          </div>

          {/* Comment 2 */}
          <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              MA
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">Minh An</span>
                <span className="text-xs text-gray-500">11:45 AM</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                Looks good! But can we make the meditation figure larger?
                <br />
                <span className="text-blue-600">@Designer A</span> please check competitor example
              </p>
              <div className="flex items-center gap-2">
                <Paperclip className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-blue-600">reference.jpg</span>
              </div>
            </div>
          </div>

          {/* Comment 3 */}
          <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              DA
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">Designer A</span>
                <span className="text-xs text-gray-500">2:30 PM</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">Updated. Also adjusted the color balance.</p>
              <div className="flex items-center gap-2">
                <Paperclip className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-blue-600">draft_v2.png</span>
              </div>
            </div>
          </div>

          {/* Comment 4 - Approval */}
          <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              ML
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">Marketing Lead</span>
                <span className="text-xs text-gray-500">3:15 PM</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">Approved with minor note - ensure brand colors are exact</p>
              <div className="flex items-center gap-2 text-sm">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Status changed to: Approved
                </Badge>
              </div>
            </div>
          </div>

          {/* Reply Input */}
          <div className="pt-2">
            <Textarea placeholder="Add a comment..." className="min-h-[80px]" />
            <div className="flex items-center justify-between mt-2">
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4 mr-2" />
                Attach File
              </Button>
              <Button size="sm">Post Comment</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PHẦN V: Asset Version Control */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Version Control</CardTitle>
          <CardDescription>Version history and changes tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Version 3 - Current */}
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">Version 3</h3>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Current</Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Dec 10, 3:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>Designer A</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <GitCompare className="h-3 w-3 mr-1" />
                  Compare
                </Button>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Changes:</span>
              <span className="ml-2">Final adjustments per Marketing feedback</span>
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Approved
              </Badge>
            </div>
          </div>

          {/* Version 2 */}
          <div className="border-l-4 border-gray-300 pl-4 py-2">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">Version 2</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Dec 10, 11:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>Designer A</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <GitCompare className="h-3 w-3 mr-1" />
                  Compare
                </Button>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Changes:</span>
              <span className="ml-2">Increased figure size, color adjustment</span>
            </div>
            <div className="mt-2">
              <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Superseded</Badge>
            </div>
          </div>

          {/* Version 1 */}
          <div className="border-l-4 border-gray-300 pl-4 py-2">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">Version 1</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Dec 9, 4:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>Designer A</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <GitCompare className="h-3 w-3 mr-1" />
                  Compare
                </Button>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Changes:</span>
              <span className="ml-2">Initial design</span>
            </div>
            <div className="mt-2">
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
            </div>
          </div>

          {/* Version 4 */}
          <div className="border-l-4 border-gray-300 pl-4 py-2">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">Version 4</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Dec 8, 2:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>Designer A</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <GitCompare className="h-3 w-3 mr-1" />
                  Compare
                </Button>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Changes:</span>
              <span className="ml-2">Color scheme update</span>
            </div>
            <div className="mt-2">
              <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Superseded</Badge>
            </div>
          </div>

          {/* Version 5 */}
          <div className="border-l-4 border-gray-300 pl-4 py-2">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">Version 5</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Dec 7, 10:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>Designer A</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <GitCompare className="h-3 w-3 mr-1" />
                  Compare
                </Button>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Changes:</span>
              <span className="ml-2">Layout refinement</span>
            </div>
            <div className="mt-2">
              <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Superseded</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PHẦN VI: Bulk Asset Management */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Asset Management</CardTitle>
          <CardDescription>Manage multiple assets at once</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-blue-900">Selected: 5 screenshots</span>
              <Button variant="outline" size="sm">
                Clear Selection
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
              <Button size="sm" variant="outline">
                <Check className="h-4 w-4 mr-2" />
                Approve All
              </Button>
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Request Revision
              </Button>
              <Button size="sm" variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-semibold text-sm">Quick Edit Options</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Resize all to:</Label>
                <Input placeholder="1242x2688" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Convert format:</Label>
                <Input placeholder="PNG to JPG" className="mt-1" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                <span className="text-sm">Apply watermark</span>
                <Button variant="outline" size="sm">
                  OFF
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                <span className="text-sm">Compress for store</span>
                <Button size="sm">ON</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PHẦN VII: Asset Performance Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Performance Tracking</CardTitle>
          <CardDescription>Performance metrics for the last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Screen 1 */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">Screen 1 (Home)</h3>
                <p className="text-sm text-gray-600">Best performing element: "5 min sessions" tag</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">3.2%</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>↑ 0.5%</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">CTR (Click-Through Rate)</div>
          </div>

          {/* Screen 2 */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">Screen 2 (Meditation List)</h3>
                <p className="text-sm text-orange-600">Note: Consider brighter colors</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">2.8%</div>
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  <span>↓ 0.2%</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">CTR (Click-Through Rate)</div>
          </div>

          {/* Screen 3 */}
          <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-green-900">Screen 3 (Sleep Stories)</h3>
                <p className="text-sm text-green-700">Best performer - keep current design</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">4.1%</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>↑ 1.2%</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-green-700">CTR (Click-Through Rate)</div>
          </div>

          {/* Recommendation */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Recommendation</h3>
                <p className="text-sm text-blue-800">
                  Move Screen 3 to position 1 for better conversion. This screen has the highest CTR and could
                  significantly improve overall app store performance.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Redirect Placeholder */}
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Asset Production Center</CardTitle>
            <CardDescription className="text-base mt-2">
              Tính năng này đã được chuyển sang hệ thống chuyên dụng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <ExternalLink className="h-10 w-10 text-blue-600" />
              </div>

              <div className="space-y-2">
                <p className="text-gray-700">
                  Để quản lý và theo dõi sản xuất asset (screenshots, icons, videos), vui lòng truy cập hệ thống chuyên
                  dụng.
                </p>
                <p className="text-sm text-gray-500">
                  Hệ thống mới cung cấp đầy đủ tính năng quản lý asset, phê duyệt và theo dõi tiến độ.
                </p>
              </div>

              <div className="pt-4">
                <Button size="lg" onClick={handleRedirect} disabled={!redirectUrl} className="gap-2">
                  {redirectUrl ? (
                    <>
                      Truy cập hệ thống Asset Production
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    "Đường dẫn sẽ được cập nhật"
                  )}
                </Button>
              </div>

              {!redirectUrl && (
                <p className="text-xs text-gray-400 pt-2">* Đường dẫn hệ thống sẽ được cấu hình bởi quản trị viên</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
