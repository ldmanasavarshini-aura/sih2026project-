import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';

export interface FollowUpDoc {
  id?: string;
  patientId: string;
  type: 'maternal' | 'chronic';
  nextVisitDate: string; // Format: 'YYYY-MM-DD'
  reminderSent: boolean;
}

/**
 * Saves a new follow-up reminder document to the "FollowUps" collection.
 */
export async function addFollowUp(
  patientId: string,
  type: 'maternal' | 'chronic',
  nextVisitDate: string
): Promise<string> {
  try {
    const colRef = collection(db, 'FollowUps');
    const docRef = await addDoc(colRef, {
      patientId,
      type,
      nextVisitDate,
      reminderSent: false
    });
    console.log(`Follow-up successfully added with doc ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error adding follow-up:', error);
    throw error;
  }
}

/**
 * Fetches all FollowUps where nextVisitDate is today or earlier, and reminderSent is false.
 */
export async function getDueFollowUps(): Promise<FollowUpDoc[]> {
  try {
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const colRef = collection(db, 'FollowUps');

    // Query follow-ups where reminderSent is false and nextVisitDate <= todayStr
    const q = query(colRef, where('reminderSent', '==', false), where('nextVisitDate', '<=', todayStr));

    const snap = await getDocs(q);
    const dueFollowUps: FollowUpDoc[] = [];
    snap.forEach((doc) => {
      dueFollowUps.push({
        id: doc.id,
        ...doc.data()
      } as FollowUpDoc);
    });

    console.log(`Fetched ${dueFollowUps.length} due follow-ups.`);
    return dueFollowUps;
  } catch (error) {
    console.error('Error fetching due follow-ups:', error);
    throw error;
  }
}

/**
 * Marks a follow-up reminder as sent.
 */
export async function markReminderAsSent(followUpId: string): Promise<void> {
  try {
    const docRef = doc(db, 'FollowUps', followUpId);
    await updateDoc(docRef, {
      reminderSent: true
    });
    console.log(`Follow-up ${followUpId} reminder marked as sent.`);
  } catch (error) {
    console.error(`Error updating reminder status for follow-up ${followUpId}:`, error);
    throw error;
  }
}

// Console testing helpers
if (typeof window !== 'undefined') {
  (window as any).addFollowUp = addFollowUp;
  (window as any).getDueFollowUps = getDueFollowUps;
  (window as any).markReminderAsSent = markReminderAsSent;
  (window as any).runFollowUpTest = async (testPatientId: string = 'patient-101') => {
    console.log(`Running Follow-Up Reminder List Test process for: ${testPatientId}`);
    try {
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0]; // yesterday
      const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0]; // tomorrow

      console.log(`1. Creating a past due follow-up (date: ${yesterdayStr})...`);
      const dueId = await addFollowUp(testPatientId, 'maternal', yesterdayStr);

      console.log(`2. Creating a future follow-up (date: ${tomorrowStr})...`);
      const futureId = await addFollowUp(testPatientId, 'chronic', tomorrowStr);

      console.log('3. Fetching due follow-ups (should include yesterday, exclude tomorrow)...');
      const dueFollowUps = await getDueFollowUps();
      console.log('Due Follow-Ups found:', dueFollowUps);

      const isDueFound = dueFollowUps.some((f) => f.id === dueId);
      const isFutureFound = dueFollowUps.some((f) => f.id === futureId);
      console.log(`Verification: due item found? ${isDueFound} | future item excluded? ${!isFutureFound}`);

      console.log('4. Marking the due follow-up reminder as sent...');
      await markReminderAsSent(dueId);

      console.log('5. Re-fetching due follow-ups (should now exclude the marked item)...');
      const remainingDue = await getDueFollowUps();
      const isStillDue = remainingDue.some((f) => f.id === dueId);
      console.log(`Verification: item successfully removed from due list? ${!isStillDue}`);

      console.log('%cFollow-up test completed successfully!', 'color: #10b981; font-weight: bold;');
      return { dueId, futureId, dueFollowUps, remainingDue };
    } catch (error) {
      console.error('Follow-up test failed:', error);
    }
  };

  console.log('followups service loaded! Call runFollowUpTest() in console to verify.');
}
