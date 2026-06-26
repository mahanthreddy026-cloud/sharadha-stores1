import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5000;
const dbPath = path.join(__dirname, "db.json");
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const allowedOrigins = [
  "http://localhost:5173",
  "https://sharadha-stores1-git-main-mahanthreddy026-clouds-projects.vercel.app",
  "https://sharadha-stores1.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());

app.options("*", cors());
app.use(express.json());

// Middleware to protect admin routes
function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing authorization header." });
  const token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid authorization header." });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Admin access required." });
    }
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

async function readDb() {
  const fileContent = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(fileContent);
}

async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

// Seed admin user on startup
(async () => {
  try {
    const db = await readDb();
    const hasAdmin = db.users && db.users.some((u) => u.role === "admin");
    if (!hasAdmin) {
      const hashed = await bcrypt.hash("admin123", 10);
      const admin = {
        id: db.users.length + 1,
        name: "Administrator",
        email: "admin@local",
        phone: "0000000000",
        password: hashed,
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      db.users.push(admin);
      await writeDb(db);
      console.log("✓ Seeded admin user: admin@local / admin123");
    }
  } catch (err) {
    console.error("Error seeding admin user:", err.message);
  }
})();

app.get("/api/products", async (req, res) => {
  const db = await readDb();
  res.json(db.products);
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const db = await readDb();
  const existing = db.users.find((user) => user.email === email);

  if (existing) {
    return res.status(409).json({ message: "Email already registered." });
  }

  const hashed = await bcrypt.hash(password, 10);

  const newUser = {
    id: db.users.length + 1,
    name,
    email,
    phone,
    password: hashed,
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  await writeDb(db);

  const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });

  res.json({
    message: "Registration successful.",
    user: { id: newUser.id, name, email, phone, role: newUser.role },
    token,
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const db = await readDb();
  const user = db.users.find((item) => item.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

  res.json({
    message: "Login successful.",
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

// Change password (requires user to be logged in)
function authenticateUser(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing authorization header." });
  const token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid authorization header." });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

app.post("/api/auth/change-password", authenticateUser, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Old and new password are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters." });
  }

  const db = await readDb();
  const user = db.users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    return res.status(401).json({ message: "Old password is incorrect." });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await writeDb(db);

  res.json({ message: "Password changed successfully." });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All contact fields are required." });
  }

  const db = await readDb();
  const contact = {
    id: db.contacts.length + 1,
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };

  db.contacts.push(contact);
  await writeDb(db);

  res.json({ message: "Contact request submitted successfully." });
});

app.post("/api/bulk-order", async (req, res) => {
  const { name, phone, details } = req.body;

  if (!name || !phone || !details) {
    return res.status(400).json({ message: "All bulk order fields are required." });
  }

  const db = await readDb();
  const bulkOrder = {
    id: db.bulkOrders.length + 1,
    name,
    phone,
    details,
    createdAt: new Date().toISOString(),
  };

  db.bulkOrders.push(bulkOrder);
  await writeDb(db);

  res.json({ message: "Bulk order request submitted successfully." });
});

app.post("/api/orders", async (req, res) => {
  const { customerName, email, address, cart, total } = req.body;

  if (!customerName || !email || !address || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: "Customer name, email, address and cart are required." });
  }

  const db = await readDb();
  const order = {
    id: db.orders.length + 1,
    customerName,
    email,
    address,
    cart,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  db.orders.push(order);
  await writeDb(db);

  res.json({ message: "Order placed successfully.", order });
});

app.put("/api/admin/orders/:id/status", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Valid status is required." });
  }

  const db = await readDb();
  const order = db.orders.find((o) => o.id == id);

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  order.status = status;
  await writeDb(db);

  res.json({ message: "Order status updated.", order });
});

app.get("/api/admin/products", authenticateJWT, async (req, res) => {
  const db = await readDb();
  res.json(db.products);
});

app.get("/api/admin/customers", authenticateJWT, async (req, res) => {
  const db = await readDb();
  res.json(db.users);
});

app.get("/api/admin/orders", authenticateJWT, async (req, res) => {
  const db = await readDb();
  res.json(db.orders);
});

app.get("/api/admin/bulk-orders", authenticateJWT, async (req, res) => {
  const db = await readDb();
  res.json(db.bulkOrders);
});

app.get("/api/admin/reports", authenticateJWT, async (req, res) => {
  const db = await readDb();
  const totalSales = db.orders.reduce((sum, order) => sum + (order.total || 0), 0);
  res.json({
    totalProducts: db.products.length,
    totalCustomers: db.users.length,
    totalOrders: db.orders.length,
    totalBulkOrders: db.bulkOrders.length,
    totalSales,
  });
});

// Admin: Make a user admin
app.post("/api/admin/make-admin", authenticateJWT, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const db = await readDb();
  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  if (user.role === "admin") {
    return res.status(400).json({ message: "User is already an admin." });
  }

  user.role = "admin";
  await writeDb(db);

  res.json({
    message: `${user.name} has been promoted to admin.`,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// Admin: Remove admin privileges
app.post("/api/admin/remove-admin", authenticateJWT, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const db = await readDb();
  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  if (user.role !== "admin") {
    return res.status(400).json({ message: "User is not an admin." });
  }

  // Prevent removing all admins
  const adminCount = db.users.filter((u) => u.role === "admin").length;
  if (adminCount <= 1) {
    return res.status(400).json({ message: "Cannot remove the last admin." });
  }

  user.role = "customer";
  await writeDb(db);

  res.json({
    message: `${user.name} has been demoted to customer.`,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
