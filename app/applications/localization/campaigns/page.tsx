"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Plus, Search, Filter } from "lucide-react"
import Link from "next/link"

const campaigns = [
  {
    id: 1,
    name: "Campaign A - iOS Global",
    status: "Active",
    kpiActual: 70000,
    kpiTarget: 100000,
    completion: 70,
    budget: "200M",
    spent: "140M",
    startDate: "2024-09-01",
    endDate: "2024-09-30",
    owner: "Cao Thanh Tú",
    platform: "iOS",
    country: "Global",
  },
  {
    id: 2,
    name: "Campaign B - Android VN",
    status: "Pending",
    kpiActual: 0,
    kpiTarget: 50000,
    completion: 0,
    budget: "50M",
    spent: "0M",
    startDate: "2024-10-01",
    endDate: "2024-10-31",
    owner: "Đàm Thị Huế",
    platform: "Android",
    country: "Vietnam",
  },
  {
    id: 3,
    name: "Campaign C - iOS US",
    status: "Completed",
    kpiActual: 120000,
    kpiTarget: 100000,
    completion: 120,
    budget: "300M",
    spent: "280M",
    startDate: "2024-08-01",
    endDate: "2024-08-31",
    owner: "Nguyễn Thị Phương Thúy",
    platform: "iOS",
    country: "US",
  },
  {
    id: 4,
    name: "Campaign D - Android JP",
    status: "Active",
    kpiActual: 45000,
    kpiTarget: 80000,
    completion: 56,
    budget: "150M",
    spent: "90M",
    startDate: "2024-09-01",
    endDate: "2024-09-30",
    owner: "Cao Thanh Tú",
    platform: "Android",
    country: "Japan",
  },
  {
    id: 5,
    name: "Campaign E - iOS KR",
    status: "Active",
    kpiActual: 92000,
    kpiTarget: 100000,
    completion: 92,
    budget: "180M",
    spent: "165M",
    startDate: "2024-09-01",
    endDate: "2024-09-30",
    owner: "Đàm Thị Huế",
    platform: "iOS",
    country: "Korea",
  },
  {
    id: 6,
    name: "Campaign F - Android TH",
    status: "Active",
    kpiActual: 35000,
    kpiTarget: 60000,
    completion: 58,
    budget: "100M",
    spent: "60M",
    startDate: "2024-09-01",
    endDate: "2024-09-30",
    owner: "Nguyễn Thị Phương Thúy",
    platform: "Android",
    country: "Thailand",
  },
]

export default function CampaignList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status.toLowerCase() === statusFilter
    const matchesPlatform = platformFilter === "all" || campaign.platform.toLowerCase() === platformFilter
    return matchesSearch && matchesStatus && matchesPlatform
  })

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Management</h1>
          <p className="text-gray-500 mt-1">Quản lý tất cả chiến dịch ASO</p>
        </div>
        <Link href="/applications/localization/campaigns/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo chiến dịch mới
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm chiến dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả platform</SelectItem>
                <SelectItem value="ios">iOS</SelectItem>
                <SelectItem value="android">Android</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Thêm bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách chiến dịch ({filteredCampaigns.length})</CardTitle>
          <CardDescription>Tổng quan tất cả chiến dịch đang chạy và đã hoàn thành</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên chiến dịch</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>KPI</TableHead>
                <TableHead>Tiến độ</TableHead>
                <TableHead>Ngân sách</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Phụ trách</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">
                    <Link href={`/applications/localization/campaigns/${campaign.id}`} className="hover:text-blue-600">
                      {campaign.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        campaign.status === "Active"
                          ? "default"
                          : campaign.status === "Completed"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        campaign.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : campaign.status === "Completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{campaign.platform}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{campaign.kpiActual.toLocaleString()}</p>
                      <p className="text-gray-500">/ {campaign.kpiTarget.toLocaleString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={campaign.completion} className="w-24" />
                      <span className="text-sm text-gray-600 min-w-[40px]">{campaign.completion}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{campaign.spent}</p>
                      <p className="text-gray-500">/ {campaign.budget}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div>
                      <p>{campaign.startDate}</p>
                      <p>{campaign.endDate}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{campaign.owner}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/applications/localization/campaigns/${campaign.id}`}>
                        <Button variant="ghost" size="sm">
                          Chi tiết
                        </Button>
                      </Link>
                      <Link href={`/applications/localization/campaigns/${campaign.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Sửa
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
