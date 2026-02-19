import * as z from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { db } from "../../src/db/client";
import { users } from "../../src/db/schema";


const tamilNaduDistricts = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
  "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam",
  "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram",
  "Ranipet", "Salem", "Sivagangai", "Tenkasi", "Thanjavur",
  "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur",
  "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar",
];

const signupInput = z.object({
  name: z.string().min(2),
  district: z.string().refine((d) =>
    tamilNaduDistricts.includes(d)
  ),
  password: z.string().min(4),
});

const loginInput = z.object({
  name: z.string().min(2),
  district: z.string(),
  password: z.string(),
});

export const authRouter = createTRPCRouter({

  // ---------- SIGNUP ----------
  signup: publicProcedure
    .input(signupInput)
    .mutation(async ({ input }) => {
      const passwordHash = await bcrypt.hash(input.password, 10);

      const [newUser] = await db
        .insert(users)
        .values({
          name: input.name,
          district: input.district,
          passwordHash,
        })
        .returning();

      return {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          district: newUser.district,
        },
      };
    }),

  // ---------- LOGIN ----------
  login: publicProcedure
    .input(loginInput)
    .mutation(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.name, input.name),
      });

      if (!user || user.district !== input.district) {
        throw new Error("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(
        input.password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          district: user.district,
        },
      };
    }),
});
