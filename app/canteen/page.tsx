"use client"

import { useState } from "react"
import {
  Plus,
  QrCode,
  History,
  ArrowRightLeft,
  Coins,
  TrendingUp,
  CheckCircle,
  XCircle,
  CreditCard,
  Info,
  Camera,
  Scan,
  Search,
  Send,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Mock data
const mockTransactions = [
  {
    id: "1",
    type: "spend",
    description: "Lunch - Chicken Rice",
    amount: -25,
    date: "2024-01-25",
    time: "12:30 PM",
    status: "completed",
  },
  {
    id: "2",
    type: "earn",
    description: "Monthly Allowance",
    amount: 500,
    date: "2024-01-24",
    time: "09:00 AM",
    status: "completed",
  },
  {
    id: "3",
    type: "spend",
    description: "Coffee - Americano",
    amount: -8,
    date: "2024-01-24",
    time: "02:15 PM",
    status: "completed",
  },
  {
    id: "4",
    type: "transfer",
    description: "Transfer to John Doe",
    amount: -50,
    date: "2024-01-23",
    time: "11:45 AM",
    status: "completed",
  },
  {
    id: "5",
    type: "topup",
    description: "Top-up via Bank Transfer",
    amount: 200,
    date: "2024-01-22",
    time: "04:20 PM",
    status: "completed",
  },
]

export default function CanteenPage() {
  const [balance] = useState(11205)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [showScanModal, setShowScanModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showInstructionsModal, setShowInstructionsModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [transferRecipient, setTransferRecipient] = useState("")
  const [scannedProduct, setScannedProduct] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const vndBalance = balance * 1000

  const handleTopUp = () => {
    if (topUpAmount && paymentMethod) {
      setShowTopUpModal(false)
      setShowSuccessModal(true)
      setTopUpAmount("")
      setPaymentMethod("")
    }
  }

  const handleTransfer = () => {
    if (transferAmount && transferRecipient) {
      const amount = Number.parseInt(transferAmount)
      if (amount > balance) {
        setShowTransferModal(false)
        setShowErrorModal(true)
      } else {
        setShowTransferModal(false)
        setShowSuccessModal(true)
        setTransferAmount("")
        setTransferRecipient("")
      }
    }
  }

  const handleScan = () => {
    setIsScanning(true)
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false)
      setScannedProduct({
        name: "Chicken Rice Set",
        price: 25,
        image: "/placeholder.svg?height=100&width=100&text=Food",
      })
    }, 2000)
  }

  const handlePurchase = () => {
    if (scannedProduct) {
      if (scannedProduct.price > balance) {
        setShowScanModal(false)
        setShowErrorModal(true)
      } else {
        setShowScanModal(false)
        setShowSuccessModal(true)
        setScannedProduct(null)
      }
    }
  }

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earn":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "spend":
        return <Coins className="h-4 w-4 text-red-600" />
      case "transfer":
        return <ArrowRightLeft className="h-4 w-4 text-blue-600" />
      case "topup":
        return <Plus className="h-4 w-4 text-purple-600" />
      default:
        return <Coins className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "earn":
      case "topup":
        return "text-green-600"
      case "spend":
      case "transfer":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">SM Rewards</h1>
        <p className="text-gray-500">Manage your SM Coins and rewards</p>
      </div>

      {/* Balance Card */}
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowInstructionsModal(true)}>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">SM Coin Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">11,205</div>
            <div className="text-sm text-gray-500">≈ {vndBalance.toLocaleString()} VND</div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowTopUpModal(true)}>
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">Top Up</h3>
            <p className="text-sm text-gray-500 mt-1">Add funds</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowScanModal(true)}>
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <QrCode className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">Scan to Pay</h3>
            <p className="text-sm text-gray-500 mt-1">Quick payment</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowHistoryModal(true)}>
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
              <History className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900">Transaction History</h3>
            <p className="text-sm text-gray-500 mt-1">View all</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowTransferModal(true)}>
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
              <ArrowRightLeft className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-medium text-gray-900">Transfer Coin</h3>
            <p className="text-sm text-gray-500 mt-1">Send to others</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest SM Coin activities</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowHistoryModal(true)}>
            View all
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.date} • {transaction.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("font-medium", getTransactionColor(transaction.type))}>
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount} SM Coins
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions Modal */}
      <Dialog open={showInstructionsModal} onOpenChange={setShowInstructionsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              SM Coin Instructions
            </DialogTitle>
            <DialogDescription>Learn how to earn and use your SM Coins</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">How to Earn SM Coins</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Monthly allowance: 500 SM Coins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Performance bonus: Up to 200 SM Coins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Referral bonus: 50 SM Coins per referral</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Top-up: 1 VND = 0.001 SM Coin</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">How to Use SM Coins</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Canteen purchases: 1 SM Coin = 1,000 VND</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Transfer to colleagues: No fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Company events: Special discounts</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Important Notes</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>SM Coins expire after 12 months</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Maximum transfer: 1,000 SM Coins per day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Minimum top-up: 50,000 VND</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Top Up Modal */}
      <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up SM Coins</DialogTitle>
            <DialogDescription>Add funds to your SM Coin balance</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (VND)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
              />
              {topUpAmount && (
                <p className="text-sm text-gray-500 mt-1">
                  ≈ {Math.floor(Number.parseInt(topUpAmount) * 0.001)} SM Coins
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="payment">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="qr">QR Code Payment</SelectItem>
                  <SelectItem value="card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleTopUp} className="flex-1">
                Confirm Top Up
              </Button>
              <Button variant="outline" onClick={() => setShowTopUpModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scan to Pay Modal */}
      <Dialog open={showScanModal} onOpenChange={setShowScanModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan to Pay</DialogTitle>
            <DialogDescription>Scan QR code to make a payment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!scannedProduct ? (
              <div className="text-center py-8">
                {isScanning ? (
                  <div className="space-y-4">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-600">Scanning...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="h-32 w-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                    <Button onClick={handleScan}>
                      <Scan className="h-4 w-4 mr-2" />
                      Start Scanning
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <img
                    src={scannedProduct.image || "/placeholder.svg"}
                    alt={scannedProduct.name}
                    className="h-24 w-24 mx-auto rounded-lg object-cover"
                  />
                  <h3 className="font-medium text-gray-900 mt-2">{scannedProduct.name}</h3>
                  <p className="text-2xl font-bold text-gray-900">{scannedProduct.price} SM Coins</p>
                  <p className="text-sm text-gray-500">≈ {(scannedProduct.price * 1000).toLocaleString()} VND</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePurchase} className="flex-1">
                    Confirm Purchase
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setScannedProduct(null)
                      setShowScanModal(false)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogDescription>View all your SM Coin transactions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="earn">Earned</SelectItem>
                  <SelectItem value="spend">Spent</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="topup">Top-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="max-h-96 overflow-auto space-y-2">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.date} • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-medium", getTransactionColor(transaction.type))}>
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount} SM Coins
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Modal */}
      <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer SM Coins</DialogTitle>
            <DialogDescription>Send SM Coins to another employee</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipient">Recipient</Label>
              <Select value={transferRecipient} onValueChange={setTransferRecipient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john.doe">John Doe - Marketing</SelectItem>
                  <SelectItem value="jane.smith">Jane Smith - HR</SelectItem>
                  <SelectItem value="mike.johnson">Mike Johnson - IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="transfer-amount">Amount (SM Coins)</Label>
              <Input
                id="transfer-amount"
                type="number"
                placeholder="Enter amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
              {transferAmount && (
                <p className="text-sm text-gray-500 mt-1">
                  ≈ {(Number.parseInt(transferAmount) * 1000).toLocaleString()} VND
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleTransfer} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Send Transfer
              </Button>
              <Button variant="outline" onClick={() => setShowTransferModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction Successful!</h3>
            <p className="text-gray-600 mb-4">Your transaction has been completed successfully.</p>
            <Button onClick={() => setShowSuccessModal(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent>
          <div className="text-center py-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Insufficient Balance</h3>
            <p className="text-gray-600 mb-4">You don't have enough SM Coins for this transaction.</p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => {
                  setShowErrorModal(false)
                  setShowTopUpModal(true)
                }}
              >
                Top Up Now
              </Button>
              <Button variant="outline" onClick={() => setShowErrorModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
