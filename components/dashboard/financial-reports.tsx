"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, TrendingUp, Calendar, Download, ArrowUpRight, ArrowDownRight } from "@/lib/icons"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock financial data - replace with real data from Supabase
const dailyRevenueData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
  ingresos: Math.floor(Math.random() * 500 + 200),
  reservas: Math.floor(Math.random() * 50 + 20),
}))

const monthlyRevenueData = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2024, i, 1).toLocaleDateString("es-ES", { month: "short" }),
  ingresos: Math.floor(Math.random() * 10000 + 5000),
  comision: 0,
})).map((item) => ({
  ...item,
  comision: Math.floor(item.ingresos * 0.15),
  neto: Math.floor(item.ingresos * 0.85),
}))

const occupancyData = Array.from({ length: 7 }, (_, i) => ({
  day: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][i],
  ocupacion: Math.floor(Math.random() * 40 + 60),
}))

const revenueByTypeData = [
  { name: "Por Hora", value: 4500, color: "#3b82f6" },
  { name: "Diario", value: 2800, color: "#10b981" },
  { name: "Mensual", value: 1200, color: "#8b5cf6" },
]

const stats = {
  todayRevenue: 287.5,
  monthRevenue: 8625.0,
  yearRevenue: 98450.0,
  todayReservations: 45,
  monthReservations: 1234,
  avgReservationValue: 6.99,
  occupancyRate: 68.5,
  platformCommission: 1293.75,
  netRevenue: 7331.25,
}

const recentTransactions = [
  {
    id: "TXN-1001",
    date: new Date(Date.now() - 3600000),
    reservation: "RES-1045",
    amount: 12.5,
    commission: 1.88,
    net: 10.62,
    status: "completed",
  },
  {
    id: "TXN-1002",
    date: new Date(Date.now() - 7200000),
    reservation: "RES-1044",
    amount: 8.0,
    commission: 1.2,
    net: 6.8,
    status: "completed",
  },
  {
    id: "TXN-1003",
    date: new Date(Date.now() - 10800000),
    reservation: "RES-1043",
    amount: 15.0,
    commission: 2.25,
    net: 12.75,
    status: "completed",
  },
  {
    id: "TXN-1004",
    date: new Date(Date.now() - 14400000),
    reservation: "RES-1042",
    amount: 6.5,
    commission: 0.98,
    net: 5.52,
    status: "pending",
  },
]

export function FinancialReports() {
  const [period, setPeriod] = useState("month")
  const [activeTab, setActiveTab] = useState("overview")

  const revenueChange = 12.5
  const reservationsChange = 8.3

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finanzas</h1>
          <p className="text-muted-foreground mt-1">Análisis detallado de ingresos y comisiones</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos del Mes</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthRevenue.toFixed(2)}</div>
            <div className="flex items-center gap-1 mt-1">
              {revenueChange > 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600">+{revenueChange}% vs mes anterior</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-600">{revenueChange}% vs mes anterior</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Netos</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.netRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Después de comisión (15%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comisión ParkeoYa</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.platformCommission.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">15% de ingresos brutos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reservas del Mes</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthReservations}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">+{reservationsChange}% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Ingresos Diarios - Últimos 30 Días</CardTitle>
              <CardDescription>Tendencia de ingresos y número de reservas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={2} name="Ingresos ($)" />
                  <Line type="monotone" dataKey="reservas" stroke="#10b981" strokeWidth={2} name="Reservas" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Desglose de Ingresos</CardTitle>
                <CardDescription>Por tipo de tarifa</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={revenueByTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-4 space-y-2">
                  {revenueByTypeData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">${item.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Occupancy Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Ocupación Semanal</CardTitle>
                <CardDescription>Porcentaje de ocupación por día</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="ocupacion" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <span className="font-medium">Promedio semanal:</span> {stats.occupancyRate}% de ocupación
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos Mensuales - Año 2024</CardTitle>
              <CardDescription>Comparación de ingresos brutos, comisión y netos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#3b82f6" name="Ingresos Brutos" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="comision" fill="#ef4444" name="Comisión (15%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="neto" fill="#10b981" name="Ingresos Netos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Valor Promedio por Reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${stats.avgReservationValue}</div>
                <p className="text-sm text-muted-foreground mt-1">Basado en {stats.monthReservations} reservas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tasa de Ocupación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.occupancyRate}%</div>
                <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${stats.occupancyRate}%` }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ingresos Anuales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${stats.yearRevenue.toLocaleString()}</div>
                <p className="text-sm text-green-600 mt-1">Proyección: $118,140</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transacciones Recientes</CardTitle>
              <CardDescription>Historial detallado de pagos y comisiones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 rounded-lg border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-medium">{transaction.id}</span>
                          <span className="text-sm text-muted-foreground">→ {transaction.reservation}</span>
                          {transaction.status === "completed" ? (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                              Completado
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded">
                              Pendiente
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.date.toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          a las {transaction.date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Monto Bruto</p>
                          <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Comisión</p>
                          <p className="font-medium text-red-600">-${transaction.commission.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Neto</p>
                          <p className="font-medium text-green-600">${transaction.net.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total de transacciones mostradas:</span>
                  <span className="font-medium">{recentTransactions.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
