import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type AdminUser = {
  uid: string;
  email: string | null;
  name: string;
  role: string;
};

export function watchAdminAuth(
  onResult: (admin: AdminUser | null) => void
): () => void {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (!user) {
      onResult(null);
      return;
    }

    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        await auth.signOut();
        onResult(null);
        return;
      }

      const data = snap.data();
      if (data.role !== "admin") {
        await auth.signOut();
        onResult(null);
        return;
      }

      onResult({
        uid: user.uid,
        email: user.email,
        name: (data.name as string) || "Admin",
        role: "admin",
      });
    } catch {
      await auth.signOut();
      onResult(null);
    }
  });
}