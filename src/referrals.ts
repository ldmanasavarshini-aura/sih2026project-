import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export interface ReferralDoc {
  id?: string;
  patientId: string;
  referredTo: string;
  reason: string;
  status: 'Pending' | 'Completed';
  timestamp: any;
}

/**
 * Creates a new referral in the "Referrals" collection.
 */
export async function createReferral(patientId: string, referredTo: string, reason: string): Promise<string> {
  try {
    const colRef = collection(db, 'Referrals');
    const docRef = await addDoc(colRef, {
      patientId,
      referredTo,
      reason,
      status: 'Pending',
      timestamp: serverTimestamp()
    });
    console.log(`Referral successfully created with doc ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error creating referral:', error);
    throw error;
  }
}

/**
 * Updates the status field of an existing referral.
 */
export async function updateReferralStatus(referralId: string, newStatus: 'Pending' | 'Completed'): Promise<void> {
  try {
    const docRef = doc(db, 'Referrals', referralId);
    await updateDoc(docRef, {
      status: newStatus
    });
    console.log(`Referral ${referralId} status successfully updated to: ${newStatus}`);
  } catch (error) {
    console.error(`Error updating status for referral ${referralId}:`, error);
    throw error;
  }
}

/**
 * Fetches all referrals for a given patient.
 */
export async function getReferralsByPatient(patientId: string): Promise<ReferralDoc[]> {
  try {
    const colRef = collection(db, 'Referrals');
    const q = query(colRef, where('patientId', '==', patientId));
    const snap = await getDocs(q);
    const referrals: ReferralDoc[] = [];
    snap.forEach((doc) => {
      referrals.push({
        id: doc.id,
        ...doc.data()
      } as ReferralDoc);
    });
    console.log(`Successfully fetched ${referrals.length} referrals for patient ID: ${patientId}`);
    return referrals;
  } catch (error) {
    console.error(`Error fetching referrals for patient ${patientId}:`, error);
    throw error;
  }
}

// Console testing helpers
if (typeof window !== 'undefined') {
  (window as any).createReferral = createReferral;
  (window as any).updateReferralStatus = updateReferralStatus;
  (window as any).getReferralsByPatient = getReferralsByPatient;
  (window as any).runReferralTest = async (testPatientId: string = 'patient-101') => {
    console.log(`Running Referral Tracker Test process for: ${testPatientId}`);
    try {
      console.log('1. Creating a new referral...');
      const refId = await createReferral(
        testPatientId,
        'Coimbatore General Hospital',
        'Severe acute respiratory condition'
      );

      console.log('2. Fetching referrals for this patient...');
      const referralsBefore = await getReferralsByPatient(testPatientId);
      console.log('Referrals before update:', referralsBefore);

      console.log('3. Updating referral status to "Completed"...');
      await updateReferralStatus(refId, 'Completed');

      console.log('4. Re-fetching referrals for verification...');
      const referralsAfter = await getReferralsByPatient(testPatientId);
      console.log('Referrals after update:', referralsAfter);

      console.log('%cReferral tracker test successfully completed!', 'color: #10b981; font-weight: bold;');
      return { refId, referralsBefore, referralsAfter };
    } catch (error) {
      console.error('Referral tracker test failed:', error);
    }
  };

  console.log('referrals service loaded! Call runReferralTest() in console to verify.');
}
