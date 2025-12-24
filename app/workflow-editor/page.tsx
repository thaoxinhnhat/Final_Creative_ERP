"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Plus, GitBranch, Zap, Save, Settings, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Types
interface NodeData {
  id: string
  type: "start" | "status"
  x: number
  y: number
  label: string
}

interface EdgeData {
  id: string
  from: string
  to: string
  label?: string
}

// Mock data
const initialStatuses = ["YÊU CẦU", "ĐANG PHÊ DUYỆT", "NGHIỆM THU", "ĐỒNG Ý", "TỪ CHỐI"]

const initialNodes: NodeData[] = [
  { id: "start", type: "start", x: 100, y: 200, label: "START" },
  { id: "yeu-cau", type: "status", x: 250, y: 200, label: "YÊU CẦU" },
  { id: "dang-phe-duyet", type: "status", x: 400, y: 150, label: "ĐANG PHÊ DUYỆT" },
  { id: "nghiem-thu", type: "status", x: 550, y: 100, label: "NGHIỆM THU" },
  { id: "dong-y", type: "status", x: 550, y: 250, label: "ĐỒNG Ý" },
]

const initialEdges: EdgeData[] = [
  { id: "start-yeu-cau", from: "start", to: "yeu-cau" },
  { id: "yeu-cau-dang-phe-duyet", from: "yeu-cau", to: "dang-phe-duyet", label: "Gửi phê duyệt" },
  { id: "dang-phe-duyet-nghiem-thu", from: "dang-phe-duyet", to: "nghiem-thu", label: "Phê duyệt" },
  { id: "nghiem-thu-dong-y", from: "nghiem-thu", to: "dong-y", label: "Hoàn thành" },
  { id: "nghiem-thu-dang-phe-duyet", from: "nghiem-thu", to: "dang-phe-duyet", label: "Yêu cầu sửa đổi" },
  { id: "yeu-cau-nghiem-thu", from: "yeu-cau", to: "nghiem-thu", label: "Bỏ qua phê duyệt" },
]

export default function WorkflowEditor() {
  const [nodes, setNodes] = useState<NodeData[]>(initialNodes)
  const [edges, setEdges] = useState<EdgeData[]>(initialEdges)
  const [showTransitionLabels, setShowTransitionLabels] = useState(true)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Modal states
  const [addStatusOpen, setAddStatusOpen] = useState(false)
  const [addTransitionOpen, setAddTransitionOpen] = useState(false)
  const [addRuleOpen, setAddRuleOpen] = useState(false)

  // Form states
  const [newStatusName, setNewStatusName] = useState("")
  const [selectedExistingStatus, setSelectedExistingStatus] = useState("")
  const [transitionFrom, setTransitionFrom] = useState("")
  const [transitionTo, setTransitionTo] = useState("")
  const [transitionName, setTransitionName] = useState("")

  const svgRef = useRef<SVGSVGElement>(null)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "yêu cầu":
        return "bg-white border-gray-300 text-gray-700"
      case "đang phê duyệt":
        return "bg-blue-50 border-blue-300 text-blue-700"
      case "nghiệm thu":
        return "bg-blue-50 border-blue-300 text-blue-700"
      case "đồng ý":
        return "bg-green-50 border-green-300 text-green-700"
      case "từ chối":
        return "bg-red-50 border-red-300 text-red-700"
      default:
        return "bg-white border-gray-300 text-gray-700"
    }
  }

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return

    setDraggingNodeId(nodeId)
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId) return

    const newNodes = nodes.map((node) =>
      node.id === draggingNodeId
        ? {
            ...node,
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y,
          }
        : node,
    )
    setNodes(newNodes)
  }

  const handleMouseUp = () => {
    setDraggingNodeId(null)
  }

  const handleNodeClick = (nodeId: string) => {
    if (draggingNodeId) return
    setSelectedNodeId(nodeId)
    setSelectedEdgeId(null)
    setSidebarOpen(true)
  }

  const handleEdgeClick = (edgeId: string) => {
    setSelectedEdgeId(edgeId)
    setSelectedNodeId(null)
    setSidebarOpen(true)
  }

  const handleAddStatus = () => {
    const statusName = newStatusName || selectedExistingStatus
    if (!statusName) return

    const newNode: NodeData = {
      id: `status-${Date.now()}`,
      type: "status",
      x: 400,
      y: 300,
      label: statusName,
    }

    setNodes([...nodes, newNode])
    setAddStatusOpen(false)
    setNewStatusName("")
    setSelectedExistingStatus("")
  }

  const handleAddTransition = () => {
    if (!transitionFrom || !transitionTo) return

    const newEdge: EdgeData = {
      id: `${transitionFrom}-${transitionTo}-${Date.now()}`,
      from: transitionFrom,
      to: transitionTo,
      label: transitionName || undefined,
    }

    setEdges([...edges, newEdge])
    setAddTransitionOpen(false)
    setTransitionFrom("")
    setTransitionTo("")
    setTransitionName("")
  }

  const handleUpdateNode = (newLabel: string) => {
    if (!selectedNodeId) return
    setNodes(nodes.map((node) => (node.id === selectedNodeId ? { ...node, label: newLabel } : node)))
  }

  const handleUpdateEdge = (newLabel: string, newFrom: string, newTo: string) => {
    if (!selectedEdgeId) return
    setEdges(
      edges.map((edge) =>
        edge.id === selectedEdgeId
          ? {
              ...edge,
              label: newLabel || undefined,
              from: newFrom,
              to: newTo,
            }
          : edge,
      ),
    )
  }

  const handleDelete = () => {
    if (selectedNodeId) {
      const node = nodes.find((n) => n.id === selectedNodeId)
      if (node?.type === "start") return

      setNodes(nodes.filter((n) => n.id !== selectedNodeId))
      setEdges(edges.filter((e) => e.from !== selectedNodeId && e.to !== selectedNodeId))
      setSelectedNodeId(null)
      setSidebarOpen(false)
    } else if (selectedEdgeId) {
      setEdges(edges.filter((e) => e.id !== selectedEdgeId))
      setSelectedEdgeId(null)
      setSidebarOpen(false)
    }
  }

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId)

  const getNodeLabel = (nodeId: string) => {
    return nodes.find((n) => n.id === nodeId)?.label || nodeId
  }

  // Draw edge path
  const getEdgePath = (from: NodeData, to: NodeData) => {
    const startX = from.x + (from.type === "start" ? 16 : 40)
    const startY = from.y + (from.type === "start" ? 16 : 12)
    const endX = to.x
    const endY = to.y + 12

    const midX = (startX + endX) / 2

    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Workflow Editor</h1>
              <p className="text-sm text-gray-500 mt-1">
                Workflow for <span className="text-blue-600 font-medium">Fashion Show</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setAddStatusOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Status
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAddTransitionOpen(true)}>
                <GitBranch className="h-4 w-4 mr-2" />
                Add Transition
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAddRuleOpen(true)}>
                <Zap className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Update Workflow
              </Button>
              <Button variant="outline" size="sm">
                Discard changes
              </Button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-labels"
                checked={showTransitionLabels}
                onCheckedChange={(checked) => setShowTransitionLabels(checked as boolean)}
              />
              <Label htmlFor="show-labels" className="text-sm font-medium">
                Show transition labels
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {nodes.length - 1} statuses
              </Badge>
              <Badge variant="outline" className="text-xs">
                {edges.length} transitions
              </Badge>
            </div>
            <div className="text-xs text-gray-500">💡 Click to select, drag to move nodes</div>
          </div>
        </div>

        {/* Canvas */}
        <div
          className="flex-1 relative overflow-hidden bg-gray-50"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <svg ref={svgRef} className="w-full h-full" style={{ minWidth: "100%", minHeight: "100%" }}>
            {/* Grid background */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Draw edges */}
            {edges.map((edge) => {
              const fromNode = nodes.find((n) => n.id === edge.from)
              const toNode = nodes.find((n) => n.id === edge.to)
              if (!fromNode || !toNode) return null

              const path = getEdgePath(fromNode, toNode)
              const isSelected = selectedEdgeId === edge.id

              return (
                <g key={edge.id}>
                  <path
                    d={path}
                    fill="none"
                    stroke={isSelected ? "#3b82f6" : "#6b7280"}
                    strokeWidth={isSelected ? 3 : 2}
                    className="cursor-pointer hover:stroke-blue-500 transition-all"
                    onClick={() => handleEdgeClick(edge.id)}
                    markerEnd="url(#arrowhead)"
                  />
                  {showTransitionLabels && edge.label && (
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2}
                      textAnchor="middle"
                      className="text-xs fill-gray-700 pointer-events-none"
                      style={{ fontSize: "11px" }}
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Arrow marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="#6b7280" />
              </marker>
            </defs>
          </svg>

          {/* Draw nodes as HTML elements positioned absolutely */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id
            const isDragging = draggingNodeId === node.id

            if (node.type === "start") {
              return (
                <div
                  key={node.id}
                  className={cn(
                    "absolute w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-[10px] transition-all duration-200 shadow-sm cursor-move select-none",
                    isSelected && "ring-2 ring-blue-500 ring-offset-1",
                    isDragging && "opacity-50",
                  )}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    transform: "translate(0, 0)",
                  }}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  onClick={() => handleNodeClick(node.id)}
                >
                  START
                </div>
              )
            }

            return (
              <div
                key={node.id}
                className={cn(
                  "absolute px-3 py-1.5 rounded-md border text-center font-medium text-xs min-w-[80px] transition-all duration-200 shadow-sm cursor-move select-none",
                  getStatusColor(node.label),
                  isSelected && "ring-2 ring-blue-500 ring-offset-1",
                  isDragging && "opacity-50",
                )}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: "translate(0, 0)",
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onClick={() => handleNodeClick(node.id)}
              >
                {node.label}
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Sidebar */}
      {sidebarOpen && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedNode ? "Status" : selectedEdge ? "Transition" : "Properties"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {selectedNode && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="node-name">Name</Label>
                  <Input id="node-name" value={selectedNode.label} onChange={(e) => handleUpdateNode(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="text-sm text-gray-600">
                    {selectedNode.type === "start" ? "Start Status" : "Regular Status"}
                  </div>
                </div>
              </>
            )}

            {selectedEdge && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="transition-name">Name</Label>
                  <Input
                    id="transition-name"
                    value={selectedEdge.label || ""}
                    onChange={(e) => handleUpdateEdge(e.target.value, selectedEdge.from, selectedEdge.to)}
                    placeholder="Enter transition name"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Path</Label>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-gray-500">From status</Label>
                      <Select
                        value={selectedEdge.from}
                        onValueChange={(val) => handleUpdateEdge(selectedEdge.label || "", val, selectedEdge.to)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {nodes.map((n) => (
                            <SelectItem key={n.id} value={n.id}>
                              {n.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">To status</Label>
                      <Select
                        value={selectedEdge.to}
                        onValueChange={(val) => handleUpdateEdge(selectedEdge.label || "", selectedEdge.from, val)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {nodes.map((n) => (
                            <SelectItem key={n.id} value={n.id}>
                              {n.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {(selectedNode || selectedEdge) && (
            <div className="p-4 border-t border-gray-200">
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={handleDelete}
                disabled={selectedNode?.type === "start"}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {selectedNode
                  ? selectedNode.type === "start"
                    ? "Cannot delete start status"
                    : "Delete status"
                  : "Delete transition"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Add Status Modal */}
      <Dialog open={addStatusOpen} onOpenChange={setAddStatusOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Status</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="existing-status">Select existing status</Label>
              <Select value={selectedExistingStatus} onValueChange={setSelectedExistingStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose from existing statuses" />
                </SelectTrigger>
                <SelectContent>
                  {initialStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-status">Create new status</Label>
              <Input
                id="new-status"
                placeholder="Enter status name"
                value={newStatusName}
                onChange={(e) => setNewStatusName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddStatusOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStatus} disabled={!newStatusName && !selectedExistingStatus}>
              Add Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Transition Modal */}
      <Dialog open={addTransitionOpen} onOpenChange={setAddTransitionOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Transition</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="from-status">From Status</Label>
              <Select value={transitionFrom} onValueChange={setTransitionFrom}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source status" />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map((n) => (
                    <SelectItem key={n.id} value={n.id}>
                      {n.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-status">To Status</Label>
              <Select value={transitionTo} onValueChange={setTransitionTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target status" />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map((n) => (
                    <SelectItem key={n.id} value={n.id}>
                      {n.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transition-name">Transition Name (Optional)</Label>
              <Input
                id="transition-name"
                placeholder="Enter transition name"
                value={transitionName}
                onChange={(e) => setTransitionName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTransitionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransition} disabled={!transitionFrom || !transitionTo}>
              Add Transition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Rule Modal */}
      <Dialog open={addRuleOpen} onOpenChange={setAddRuleOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Rule</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Rules Coming Soon</h3>
              <p className="text-sm text-gray-500">
                This feature will allow you to add conditions and validations to your workflow transitions.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRuleOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
