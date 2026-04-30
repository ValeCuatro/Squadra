import express from 'express';
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
api.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Areas and SubAreas
api.get('/areas', async (req, res) => {
  try {
    const areas = await prisma.area.findMany({
      include: { subAreas: true, responsible: true },
    });
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch areas' });
  }
});

api.post('/areas', async (req, res) => {
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

api.post('/areas/:id/subareas', async (req, res) => {
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
api.get('/tickets', async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        area: true,
        subArea: true,
        assignee: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Map status from Prisma to frontend expected format if needed
    const formattedTickets = tickets.map(ticket => ({
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

api.post('/tickets', async (req, res) => {
  try {
    const { title, description, areaId, subAreaId, priority, assigneeId } = req.body;
    
    const dbPriority = priority === 'baja' ? 'LOW' :
                       priority === 'media' ? 'MEDIUM' :
                       priority === 'alta' ? 'HIGH' : 'URGENT';
                       
    const ticket = await prisma.ticket.create({
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
      }
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
api.put('/tickets/:id/status', async (req, res) => {
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
      }
    });
    
    res.json(ticket);
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

const PORT = 3001;
api.listen(PORT, () => {
  console.log(`Backend API corriendo en el puerto ${PORT}`);
});

export default api;
