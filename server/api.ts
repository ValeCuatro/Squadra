import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const api = express();

// Middleware
api.use(express.json());

// Users
api.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

api.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, email, role, phone, status } = req.body;
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: role || 'FIELD_WORKER',
        phone: phone || null,
        status: status || 'OFF_DUTY',
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Areas and SubAreas
api.get('/areas', async (req: Request, res: Response) => {
  try {
    const areas = await prisma.area.findMany({
      include: { subAreas: true, responsible: true },
    });
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch areas' });
  }
});

api.post('/areas', async (req: Request, res: Response) => {
  try {
    const { name, image, responsibleId } = req.body;
    const newArea = await prisma.area.create({
      data: {
        name,
        image: image || null,
        responsibleId: responsibleId || null,
      },
      include: { subAreas: true, responsible: true },
    });
    res.status(201).json(newArea);
  } catch (error) {
    console.error("Create area error:", error);
    res.status(500).json({ error: 'Failed to create area' });
  }
});

api.post('/areas/:id/subareas', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const newSubArea = await prisma.subArea.create({
      data: {
        name,
        areaId: id,
      },
    });
    res.status(201).json(newSubArea);
  } catch (error) {
    console.error("Create subarea error:", error);
    res.status(500).json({ error: 'Failed to create subarea' });
  }
});

// Tickets
api.get('/tickets', async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        area: true,
        subArea: true,
        assignee: true,
        equipments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Map status from Prisma to frontend expected format if needed
    const formattedTickets = tickets.map((ticket: any) => ({
      ...ticket,
      status: ticket.status === 'PENDING' ? 'pendiente' : 
              ticket.status === 'IN_PROGRESS' ? 'en_proceso' : 'resuelto',
      priority: ticket.priority === 'LOW' ? 'baja' :
                ticket.priority === 'MEDIUM' ? 'media' :
                ticket.priority === 'HIGH' ? 'alta' : 'urgente',
      photos: [], // mock for now
      comments: [] // mock for now until we add TicketComments model
    }));
    
    res.json(formattedTickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

api.post('/tickets', async (req: Request, res: Response) => {
  try {
    const { title, description, areaId, subAreaId, priority, assigneeId, equipmentIds } = req.body;
    
    const dbPriority = priority === 'baja' ? 'LOW' :
                       priority === 'media' ? 'MEDIUM' :
                       priority === 'alta' ? 'HIGH' : 'URGENT';
                       
    const ticket = await prisma.$transaction(async (tx) => {
      const createdTicket = await tx.ticket.create({
        data: {
          title,
          description,
          priority: dbPriority,
          areaId,
          subAreaId: subAreaId || null,
          assigneeId: assigneeId || null,
          status: 'PENDING'
        },
        include: {
          area: true,
          subArea: true,
          assignee: true,
          equipments: true,
        }
      });

      if (equipmentIds && equipmentIds.length > 0) {
        await tx.equipment.updateMany({
          where: { id: { in: equipmentIds } },
          data: { status: 'RESERVED', ticketId: createdTicket.id }
        });
      }

      return createdTicket;
    });
    
    // Formatear para que el front lo entienda si se devuelve en la respuesta
    const formattedTicket = {
      ...ticket,
      status: 'pendiente',
      priority: priority,
      photos: [],
      comments: []
    };
    
    res.status(201).json(formattedTicket);
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Update ticket status
api.put('/tickets/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body; // status is from frontend ('pendiente', 'en_proceso', 'resuelto')
    
    const dbStatus = status === 'pendiente' ? 'PENDING' :
                     status === 'en_proceso' ? 'IN_PROGRESS' : 'RESOLVED';
                     
    const ticket = await prisma.ticket.update({
      where: { id },
      data: { status: dbStatus },
      include: {
        area: true,
        subArea: true,
        assignee: true,
        equipments: true,
      }
    });
    
    res.json(ticket);
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

// --- INVENTORY ---
api.get('/inventory', async (req, res) => {
  try {
    const inventory = await prisma.inventoryItem.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

api.post('/inventory/items', async (req, res) => {
  try {
    const { name, category, currentStock, minStock, unit } = req.body;
    const newItem = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        currentStock: Number(currentStock),
        minStock: Number(minStock),
        unit
      }
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Create inventory item error:", error);
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

api.get('/inventory/transactions', async (req, res) => {
  try {
    const transactions = await prisma.inventoryTransaction.findMany({
      include: {
        item: true,
        user: true,
        ticket: true
      },
      orderBy: { date: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory transactions' });
  }
});

api.post('/inventory/transactions', async (req, res) => {
  try {
    const { itemId, userId, type, quantity, ticketId } = req.body;

    // Validate type
    if (type !== 'IN' && type !== 'OUT') {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    const item = await prisma.inventoryItem.findUnique({ where: { id: itemId } });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // En caso de ser OUT, verificar stock? Dejamos que descuente igual.
    const newStock = type === 'IN' ? item.currentStock + quantity : item.currentStock - quantity;

    // Perform transaction and update item in a Prisma transaction
    const [transaction, updatedItem] = await prisma.$transaction([
      prisma.inventoryTransaction.create({
        data: {
          itemId,
          userId,
          type,
          quantity,
          ticketId: ticketId || null
        }
      }),
      prisma.inventoryItem.update({
        where: { id: itemId },
        data: { currentStock: newStock }
      })
    ]);

    res.status(201).json({ transaction, updatedItem });
  } catch (error) {
    console.error("Inventory transaction error:", error);
    res.status(500).json({ error: 'Failed to create inventory transaction' });
  }
});

// --- EQUIPMENT ---
api.get('/equipment', async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany({
      include: {
        assignee: true,
        ticket: true,
      },
      orderBy: { name: 'asc' }
    });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

api.post('/equipment', async (req, res) => {
  try {
    const { name } = req.body;
    const newEquipment = await prisma.equipment.create({
      data: { name },
    });
    res.status(201).json(newEquipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create equipment' });
  }
});

api.put('/equipment/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assigneeId, ticketId, action } = req.body;

    const equipment = await prisma.$transaction(async (tx) => {
      const updated = await tx.equipment.update({
        where: { id },
        data: {
          status,
          assigneeId: assigneeId || null,
          ticketId: ticketId || null,
        },
      });

      if (action && assigneeId) {
        await tx.equipmentLog.create({
          data: {
            equipmentId: id,
            userId: assigneeId,
            ticketId: ticketId || null,
            action: action,
          }
        });
      }

      return updated;
    });

    res.json(equipment);
  } catch (error) {
    console.error("Update equipment error:", error);
    res.status(500).json({ error: 'Failed to update equipment' });
  }
});

// --- DASHBOARD STATS ---
api.get('/dashboard/stats', async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // 1. Tickets KPIs
    const allTickets = await prisma.ticket.findMany();
    const total = allTickets.length;
    const pending = allTickets.filter(t => t.status === 'PENDING').length;
    const inProgress = allTickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolved = allTickets.filter(t => t.status === 'RESOLVED').length;
    const completionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // MTTR: Mean Time To Repair
    let mttrHours = 0;
    const resolvedTickets = allTickets.filter(t => t.status === 'RESOLVED' && t.updatedAt > t.createdAt);
    if (resolvedTickets.length > 0) {
      const totalRepairTime = resolvedTickets.reduce((acc, t) => {
        return acc + (t.updatedAt.getTime() - t.createdAt.getTime());
      }, 0);
      mttrHours = Math.round((totalRepairTime / resolvedTickets.length) / (1000 * 60 * 60)); // in hours
    }

    // 2. Inventory Alerts (Stock <= minStock) and "Burn Rate" estimation
    const inventory = await prisma.inventoryItem.findMany();
    const lowStockItems = inventory.filter(i => i.currentStock <= i.minStock);
    
    // Get recent transactions to calculate velocity
    const recentOutTransactions = await prisma.inventoryTransaction.findMany({
      where: {
        type: 'OUT',
        date: { gte: thirtyDaysAgo }
      }
    });

    const inventoryAlerts = lowStockItems.map(item => {
      const itemTx = recentOutTransactions.filter(tx => tx.itemId === item.id);
      const totalConsumed30d = itemTx.reduce((acc, tx) => acc + tx.quantity, 0);
      const dailyVelocity = totalConsumed30d / 30;
      
      let estimatedDaysRemaining = null;
      if (dailyVelocity > 0) {
        estimatedDaysRemaining = Math.floor(item.currentStock / dailyVelocity);
      }

      return {
        id: item.id,
        name: item.name,
        currentStock: item.currentStock,
        minStock: item.minStock,
        unit: item.unit,
        dailyVelocity: Number(dailyVelocity.toFixed(2)),
        estimatedDaysRemaining
      };
    });

    // 3. Consumption Trend for Charts (group by day)
    const consumptionMap = new Map();
    recentOutTransactions.forEach(tx => {
      const dateStr = tx.date.toISOString().split('T')[0];
      if (!consumptionMap.has(dateStr)) {
        consumptionMap.set(dateStr, { date: dateStr, quantity: 0 });
      }
      consumptionMap.get(dateStr).quantity += tx.quantity;
    });
    
    const consumptionTrend = Array.from(consumptionMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // 4. Tasks status distribution for Pie Chart
    const taskStatusDistribution = [
      { name: 'Pendientes', value: pending },
      { name: 'En Proceso', value: inProgress },
      { name: 'Resueltas', value: resolved },
    ];

    res.json({
      kpis: {
        total,
        pending,
        inProgress,
        resolved,
        completionRate,
        mttrHours
      },
      inventoryAlerts,
      consumptionTrend,
      taskStatusDistribution
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// --- STAFF & PROFILE MANAGEMENT ---
api.get('/staff/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        schedules: true,
        certifications: true,
        leaveRequests: { orderBy: { createdAt: 'desc' } },
        shiftSwapsRequested: { include: { recipient: true }, orderBy: { createdAt: 'desc' } },
        shiftSwapsReceived: { include: { requester: true }, orderBy: { createdAt: 'desc' } }
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

api.post('/staff/profile/:id/clock', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'ON_DUTY' | 'OFF_DUTY'
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Leaves
api.get('/staff/leaves', async (req, res) => {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

api.post('/staff/leaves', async (req, res) => {
  try {
    const { userId, startDate, endDate, reason } = req.body;
    const newLeave = await prisma.leaveRequest.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason
      }
    });
    res.status(201).json(newLeave);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create leave request' });
  }
});

api.put('/staff/leaves/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'APPROVED' | 'REJECTED'
    const updatedLeave = await prisma.leaveRequest.update({
      where: { id },
      data: { status }
    });
    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update leave request' });
  }
});

// Shift Swaps
api.get('/staff/swaps', async (req, res) => {
  try {
    const swaps = await prisma.shiftSwapRequest.findMany({
      include: { requester: true, recipient: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(swaps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shift swaps' });
  }
});

api.post('/staff/swaps', async (req, res) => {
  try {
    const { requesterId, recipientId, dateToSwap, reason } = req.body;
    const newSwap = await prisma.shiftSwapRequest.create({
      data: {
        requesterId,
        recipientId,
        dateToSwap: new Date(dateToSwap),
        reason
      }
    });
    res.status(201).json(newSwap);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shift swap request' });
  }
});

api.put('/staff/swaps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'APPROVED' | 'REJECTED'
    const updatedSwap = await prisma.shiftSwapRequest.update({
      where: { id },
      data: { status }
    });
    res.json(updatedSwap);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shift swap request' });
  }
});

const PORT = 3001;
api.listen(PORT, () => {
  console.log(`Backend API corriendo en el puerto ${PORT}`);
});

export default api;
