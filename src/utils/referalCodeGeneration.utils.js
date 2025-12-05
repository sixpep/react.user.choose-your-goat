import { collection, getDocs, query, where, limit, writeBatch, doc } from "firebase/firestore";
import { db } from "../firebase/setup";

export const generateReferralCode = async (prefix = "TMR", length = 6) => {
  // Safe characters: no 0/O, 1/I/L to avoid confusion
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";

  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    // Generate random code
    const randomPart = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

    // Format: PREFIX-RANDOM-TIMESTAMP
    const code = `${prefix.toUpperCase()}-${randomPart}`;

    // Check if code exists in DB
    if (!(await isCodeTaken(code))) {
      return code;
    }

    attempts++;
  }

  throw new Error(`Could not generate unique referral code after ${maxAttempts} attempts`);
};

// Check if code exists
const isCodeTaken = async (code) => {
  const userSnap = await getDocs(query(collection(db, "users"), where("referralCode", "==", code), limit(1)));

  if (!userSnap.empty) {
    return true;
  }

  return false;
};

export const assignReferralCodesToAllUsers = async () => {
  console.log("🚀 Starting referral code assignment...");

  try {
    // 1. Fetch all users
    const usersSnap = await getDocs(collection(db, "users"));
    console.log(`📋 Found ${usersSnap.size} users`);

    const batch = writeBatch(db);
    let successCount = 0;
    let skipCount = 0;

    // 2. Process each user
    for (const userDoc of usersSnap.docs) {
      const userData = userDoc.data();
      const currentCode = userData.referralCode;

      // Skip if already has valid code
      if (currentCode && /^[A-Z]{3}-[A-Z1-9]{6,8}$/.test(currentCode)) {
        console.log(`⏭️  Skipping ${userDoc.id}: ${currentCode}`);
        skipCount++;
        continue;
      }

      try {
        // 3. Generate unique code
        const newCode = await generateReferralCode("TMR", 6);
        console.log(`✅ Assigning ${newCode} to ${userDoc.id}`);

        // 4. Add to batch
        batch.update(doc(db, "users", userDoc.id), {
          referralCode: newCode,
        });

        successCount++;
      } catch (error) {
        console.error(`❌ Failed for ${userDoc.id}:`, error.message);
      }
    }

    // 5. Execute batch (max 500 ops per batch)
    if (batch._mutations.length > 0) {
      await batch.commit();
      console.log(`🎉 Batch committed! ${successCount} codes assigned, ${skipCount} skipped`);
    } else {
      console.log("ℹ️  No changes needed");
    }

    return { successCount, skipCount, total: usersSnap.size };
  } catch (error) {
    console.error("💥 Batch assignment failed:", error);
    throw error;
  }
};
