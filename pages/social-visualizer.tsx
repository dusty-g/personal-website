import Head from "next/head";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Nav from "src/components/nav";
import styles from "../styles/SocialVisualizer.module.css";

import {
  GoogleAuthProvider,
  type Auth,
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  type DocumentData,
  type Firestore,
  type Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuthC, getDb } from "src/utils/firebaseClient";

const GROUP_ID = "default";
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

type GroupMeta = {
  name?: string;
  autoAcceptPeerTags?: boolean;
  description?: string;
};

type Member = {
  id: string;
  displayName: string;
  email?: string | null;
  photoURL?: string | null;
  joinedAt?: Timestamp | null;
};

type Attribute = {
  id: string;
  name: string;
  createdBy?: string;
  createdAt?: Timestamp | null;
};

type AssignmentStatus = "pending" | "accepted" | "declined";

type AttributeAssignment = {
  id: string;
  attributeId: string;
  subjectUid: string;
  assertedByUid: string;
  status: AssignmentStatus;
  note?: string;
  createdAt?: Timestamp | null;
  resolvedAt?: Timestamp | null;
};

function displayNameForMember(member: Member) {
  return member.displayName || member.email || "Unnamed friend";
}

function formatTimestamp(ts?: Timestamp | null) {
  if (!ts) return "";
  try {
    return ts.toDate().toLocaleString();
  } catch {
    return "";
  }
}

function combinations<T>(items: T[]): T[][] {
  const results: T[][] = [];
  const n = items.length;
  for (let mask = 1; mask < 1 << n; mask += 1) {
    const combo: T[] = [];
    for (let i = 0; i < n; i += 1) {
      if (mask & (1 << i)) combo.push(items[i]);
    }
    results.push(combo);
  }
  return results;
}

export default function SocialVisualizerPage() {
  const [isClient, setIsClient] = useState(false);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [groupMeta, setGroupMeta] = useState<GroupMeta | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [assignments, setAssignments] = useState<AttributeAssignment[]>([]);

  const [newAttributeName, setNewAttributeName] = useState("");
  const [assignmentAttributeId, setAssignmentAttributeId] = useState("");
  const [assignmentSubjectUid, setAssignmentSubjectUid] = useState("");
  const [selection, setSelection] = useState<string[]>([]);

  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const authInstance = getAuthC();
    setAuth(authInstance);
    const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    setDb(getDb());
  }, [isClient]);

  useEffect(() => {
    if (!db) return;

    const groupRef = doc(db, "friendGroups", GROUP_ID);

    const unsubGroup = onSnapshot(groupRef, (snapshot) => {
      setGroupMeta((snapshot.data() as GroupMeta | undefined) ?? null);
    });

    const membersRef = collection(groupRef, "members");
    const unsubMembers = onSnapshot(
      query(membersRef, orderBy("displayName")),
      (snapshot) => {
        const nextMembers: Member[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as DocumentData;
          return {
            id: docSnap.id,
            displayName: data.displayName ?? "",
            email: data.email ?? null,
            photoURL: data.photoURL ?? null,
            joinedAt: data.joinedAt ?? null,
          };
        });
        setMembers(nextMembers);
      }
    );

    const attributesRef = collection(groupRef, "attributes");
    const unsubAttributes = onSnapshot(
      query(attributesRef, orderBy("name")),
      (snapshot) => {
        const nextAttributes: Attribute[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as DocumentData;
          return {
            id: docSnap.id,
            name: data.name ?? "",
            createdBy: data.createdBy,
            createdAt: data.createdAt ?? null,
          };
        });
        setAttributes(nextAttributes);
      }
    );

    const assignmentsRef = collection(groupRef, "attributeAssignments");
    const unsubAssignments = onSnapshot(
      query(assignmentsRef, orderBy("createdAt", "desc")),
      (snapshot) => {
        const nextAssignments: AttributeAssignment[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as DocumentData;
          return {
            id: docSnap.id,
            attributeId: data.attributeId,
            subjectUid: data.subjectUid,
            assertedByUid: data.assertedByUid,
            status: data.status ?? "pending",
            note: data.note,
            createdAt: data.createdAt ?? null,
            resolvedAt: data.resolvedAt ?? null,
          };
        });
        setAssignments(nextAssignments);
      }
    );

    return () => {
      unsubGroup();
      unsubMembers();
      unsubAttributes();
      unsubAssignments();
    };
  }, [db]);

  useEffect(() => {
    setSelection((prev) => prev.filter((id) => attributes.some((attr) => attr.id === id)));
  }, [attributes]);

  const attributeMap = useMemo(() => {
    const map = new Map<string, Attribute>();
    attributes.forEach((attr) => map.set(attr.id, attr));
    return map;
  }, [attributes]);

  const memberMap = useMemo(() => {
    const map = new Map<string, Member>();
    members.forEach((member) => map.set(member.id, member));
    return map;
  }, [members]);

  const acceptedAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.status === "accepted"),
    [assignments]
  );

  const memberAttributeSet = useMemo(() => {
    const map = new Map<string, Set<string>>();
    acceptedAssignments.forEach((assignment) => {
      const existing = map.get(assignment.subjectUid) ?? new Set<string>();
      existing.add(assignment.attributeId);
      map.set(assignment.subjectUid, existing);
    });
    return map;
  }, [acceptedAssignments]);

  const pendingForUser = useMemo(() => {
    if (!user) return [];
    return assignments.filter(
      (assignment) => assignment.status === "pending" && assignment.subjectUid === user.uid
    );
  }, [assignments, user]);

  const isMember = useMemo(() => {
    if (!user) return false;
    return members.some((member) => member.id === user.uid);
  }, [members, user]);

  const autoAcceptPeerTags = groupMeta?.autoAcceptPeerTags ?? false;

  const sortedMembers = useMemo(
    () => [...members].sort((a, b) => displayNameForMember(a).localeCompare(displayNameForMember(b))),
    [members]
  );

  const sortedAttributes = useMemo(
    () => [...attributes].sort((a, b) => a.name.localeCompare(b.name)),
    [attributes]
  );

  const selectionDetails = useMemo(() => {
    const combos = combinations(selection);
    const results = combos.map((combo) => {
      const membersForCombo = sortedMembers.filter((member) => {
        const set = memberAttributeSet.get(member.id);
        if (!set) return false;
        return combo.every((attrId) => set.has(attrId));
      });
      return { combo, members: membersForCombo };
    });
    return results.filter((entry) => entry.members.length > 0);
  }, [selection, sortedMembers, memberAttributeSet]);

  const vennBuckets = useMemo(() => {
    if (selection.length === 0) return new Map<string, Member[]>();
    const buckets = new Map<string, Member[]>();
    sortedMembers.forEach((member) => {
      const set = memberAttributeSet.get(member.id);
      if (!set) return;
      const present = selection.filter((attrId) => set.has(attrId));
      if (present.length === 0) return;
      const key = [...present].sort().join("|");
      const existing = buckets.get(key) ?? [];
      existing.push(member);
      buckets.set(key, existing);
    });
    return buckets;
  }, [selection, sortedMembers, memberAttributeSet]);

  const vennEntries = useMemo(() => Array.from(vennBuckets.entries()), [vennBuckets]);

  useEffect(() => {
    if (!user || !db) return;
    if (!isMember) return;
    const groupRef = doc(db, "friendGroups", GROUP_ID);
    const memberRef = doc(collection(groupRef, "members"), user.uid);
    const displayName = user.displayName ?? user.email ?? "Friend";
    setDoc(
      memberRef,
      {
        displayName,
        email: user.email ?? null,
        photoURL: user.photoURL ?? null,
      },
      { merge: true }
    ).catch((error) => {
      console.error("Failed to refresh member record", error);
    });
  }, [user, db, isMember]);

  const resetFeedback = () => {
    setActionError(null);
    setActionMessage(null);
  };

  const handleSignIn = async () => {
    if (!auth) return;
    resetFeedback();
    try {
      await signInWithPopup(auth, googleProvider);
      setActionMessage("Signed in successfully");
    } catch (error) {
      console.error(error);
      setActionError("Google sign-in failed. Try again.");
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    resetFeedback();
    try {
      await signOut(auth);
      setActionMessage("Signed out");
    } catch (error) {
      console.error(error);
      setActionError("Unable to sign out right now.");
    }
  };

  const handleJoinGroup = async () => {
    if (!db || !user) {
      setActionError("Sign in to join the group.");
      return;
    }
    resetFeedback();
    try {
      const groupRef = doc(db, "friendGroups", GROUP_ID);
      await setDoc(
        groupRef,
        {
          name: groupMeta?.name ?? "Founding Friend Group",
          autoAcceptPeerTags: groupMeta?.autoAcceptPeerTags ?? false,
          description:
            groupMeta?.description ??
            "A private sandbox to record the quirks, habits, and shared stories inside our crew.",
        },
        { merge: true }
      );

      const memberRef = doc(collection(groupRef, "members"), user.uid);
      await setDoc(
        memberRef,
        {
          displayName: user.displayName ?? user.email ?? "Friend",
          email: user.email ?? null,
          photoURL: user.photoURL ?? null,
          joinedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setActionMessage("Joined the friend group");
    } catch (error) {
      console.error(error);
      setActionError("Unable to join the group just yet. Please retry.");
    }
  };

  const handleCreateAttribute = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db || !user) {
      setActionError("Sign in to create attributes.");
      return;
    }
    if (!isMember) {
      setActionError("Join the group first.");
      return;
    }
    const trimmed = newAttributeName.trim();
    if (!trimmed) {
      setActionError("Give the attribute a name first.");
      return;
    }
    if (attributes.some((attribute) => attribute.name.toLowerCase() === trimmed.toLowerCase())) {
      setActionError("That attribute already exists.");
      return;
    }
    resetFeedback();
    try {
      const groupRef = doc(db, "friendGroups", GROUP_ID);
      const attributesRef = collection(groupRef, "attributes");
      await addDoc(attributesRef, {
        name: trimmed,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewAttributeName("");
      setActionMessage(`Added attribute “${trimmed}”`);
    } catch (error) {
      console.error(error);
      setActionError("Could not save that attribute. Try again.");
    }
  };

  const handleAssignAttribute = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db || !user) {
      setActionError("Sign in to add attributes to friends.");
      return;
    }
    if (!isMember) {
      setActionError("Join the group first.");
      return;
    }
    if (!assignmentAttributeId || !assignmentSubjectUid) {
      setActionError("Pick an attribute and a friend.");
      return;
    }

    const alreadyAccepted = memberAttributeSet
      .get(assignmentSubjectUid)
      ?.has(assignmentAttributeId);
    if (alreadyAccepted) {
      setActionError("That friend already has this attribute.");
      return;
    }

    const existingPending = assignments.find(
      (assignment) =>
        assignment.attributeId === assignmentAttributeId &&
        assignment.subjectUid === assignmentSubjectUid &&
        assignment.status === "pending"
    );
    if (existingPending) {
      setActionError("There is already a pending confirmation for that tag.");
      return;
    }

    resetFeedback();
    try {
      const groupRef = doc(db, "friendGroups", GROUP_ID);
      const assignmentsRef = collection(groupRef, "attributeAssignments");
      const status: AssignmentStatus =
        assignmentSubjectUid === user.uid || autoAcceptPeerTags ? "accepted" : "pending";
      await addDoc(assignmentsRef, {
        attributeId: assignmentAttributeId,
        subjectUid: assignmentSubjectUid,
        assertedByUid: user.uid,
        status,
        createdAt: serverTimestamp(),
        resolvedAt: status === "accepted" ? serverTimestamp() : null,
      });
      setAssignmentAttributeId("");
      setAssignmentSubjectUid("");
      setActionMessage(
        status === "accepted"
          ? "Attribute saved!"
          : "Request sent for confirmation."
      );
    } catch (error) {
      console.error(error);
      setActionError("We could not save that tag.");
    }
  };

  const handleResolveAssertion = async (assignmentId: string, status: "accepted" | "declined") => {
    if (!db || !user) {
      setActionError("Sign in to respond to tags.");
      return;
    }
    resetFeedback();
    try {
      const groupRef = doc(db, "friendGroups", GROUP_ID);
      const assignmentRef = doc(collection(groupRef, "attributeAssignments"), assignmentId);
      await updateDoc(assignmentRef, {
        status,
        resolvedAt: serverTimestamp(),
      });
      setActionMessage(status === "accepted" ? "Tag confirmed." : "Tag declined.");
    } catch (error) {
      console.error(error);
      setActionError("Unable to update that tag.");
    }
  };

  const handleToggleSelection = (attributeId: string) => {
    setSelection((prev) =>
      prev.includes(attributeId)
        ? prev.filter((id) => id !== attributeId)
        : [...prev, attributeId]
    );
  };

  const handleExportCsv = () => {
    if (!isClient) return;
    if (sortedMembers.length === 0 || sortedAttributes.length === 0) {
      setActionError("Need at least one friend and one attribute to export.");
      return;
    }
    resetFeedback();
    const header = ["Member", ...sortedAttributes.map((attribute) => attribute.name)];
    const rows = sortedMembers.map((member) => {
      const set = memberAttributeSet.get(member.id) ?? new Set<string>();
      const cells = sortedAttributes.map((attribute) => (set.has(attribute.id) ? "1" : "0"));
      return [displayNameForMember(member), ...cells];
    });

    const escapeCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
    const csv = [header, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `friend-attributes-${GROUP_ID}.csv`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setActionMessage("CSV downloaded");
  };

  return (
    <>
      <Head>
        <title>Friend Attribute Visualizer</title>
        <meta
          name="description"
          content="Collaborative tagging tool for close friends with Google sign-in, approvals, and playful visualizations."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Nav />
      <main className={`main ${styles.wrapper}`}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Friend attribute sandbox</p>
            <h1>Map the quirks in your crew</h1>
            <p className={styles.lede}>
              Sign in with Google, join the private group, and co-create the attributes that make your
              people who they are. Approvals keep every tag respectful, and the visualization tools
              show the overlap instantly.
            </p>
          </div>
          <div className={styles.authBox}>
            {user ? (
              <>
                <div className={styles.authSummary}>
                  <span className={styles.avatar}>
                    {user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.photoURL} alt={user.displayName ?? "Signed in friend"} />
                    ) : (
                      (user.displayName ?? user.email ?? "You").charAt(0).toUpperCase()
                    )}
                  </span>
                  <div>
                    <p>{user.displayName ?? user.email ?? "You"}</p>
                    <p className={styles.authMeta}>Signed in with Google</p>
                  </div>
                </div>
                <button className={styles.secondaryButton} onClick={handleSignOut}>
                  Sign out
                </button>
              </>
            ) : (
              <button className={styles.primaryButton} onClick={handleSignIn} disabled={!isClient}>
                Sign in with Google
              </button>
            )}
          </div>
        </header>

        {(actionMessage || actionError) && (
          <div className={actionError ? styles.bannerError : styles.bannerSuccess}>
            {actionError ?? actionMessage}
          </div>
        )}

        <section className={styles.panel}>
          <header>
            <h2>Group access</h2>
            <p className={styles.panelHint}>
              This beta runs inside one invite-only circle. Joining stores your profile inside the same
              Firebase project the rest of the site uses.
            </p>
          </header>
          {user ? (
            isMember ? (
              <div className={styles.cardRow}>
                <div className={styles.card}>
                  <p className={styles.cardTitle}>You are in</p>
                  <p className={styles.cardBody}>
                    {groupMeta?.name ?? "Founding Friend Group"}
                    {autoAcceptPeerTags ? " · Peer tags auto-accept" : " · Approvals required"}
                  </p>
                  <p className={styles.cardBody}>
                    {members.length} member{members.length === 1 ? "" : "s"} total
                  </p>
                </div>
              </div>
            ) : (
              <button className={styles.primaryButton} onClick={handleJoinGroup}>
                Join the private group
              </button>
            )
          ) : (
            <p className={styles.panelHint}>Sign in to see the invite controls.</p>
          )}
        </section>

        <section className={styles.panel}>
          <header>
            <h2>Attributes</h2>
            <p className={styles.panelHint}>
              Create traits, talents, or running jokes. Once confirmed, they become part of the shared
              visualization matrix.
            </p>
          </header>
          <form className={styles.formRow} onSubmit={handleCreateAttribute}>
            <label className={styles.formLabel}>
              Attribute name
              <input
                value={newAttributeName}
                onChange={(event) => setNewAttributeName(event.target.value)}
                placeholder="Plays guitar, hates olives, owns a canoe…"
                disabled={!user || !isMember}
              />
            </label>
            <button className={styles.primaryButton} type="submit" disabled={!user || !isMember}>
              Save attribute
            </button>
          </form>
          {sortedAttributes.length > 0 ? (
            <ul className={styles.attributeList}>
              {sortedAttributes.map((attribute) => (
                <li key={attribute.id}>
                  <span>{attribute.name}</span>
                  <button
                    type="button"
                    className={selection.includes(attribute.id) ? styles.toggleOn : styles.toggleOff}
                    onClick={() => handleToggleSelection(attribute.id)}
                  >
                    {selection.includes(attribute.id) ? "Selected" : "Visualize"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>No attributes yet. Be the first to add one!</p>
          )}
        </section>

        <section className={styles.panel}>
          <header>
            <h2>Tag friends</h2>
            <p className={styles.panelHint}>
              Tag yourself or your friends. Peer assertions stay pending until they approve unless the
              group flips on auto-accept.
            </p>
          </header>
          <form className={styles.formGrid} onSubmit={handleAssignAttribute}>
            <label className={styles.formLabel}>
              Attribute
              <select
                value={assignmentAttributeId}
                onChange={(event) => setAssignmentAttributeId(event.target.value)}
                disabled={!user || !isMember || attributes.length === 0}
              >
                <option value="">Select an attribute</option>
                {sortedAttributes.map((attribute) => (
                  <option key={attribute.id} value={attribute.id}>
                    {attribute.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.formLabel}>
              Friend
              <select
                value={assignmentSubjectUid}
                onChange={(event) => setAssignmentSubjectUid(event.target.value)}
                disabled={!user || !isMember || members.length === 0}
              >
                <option value="">Select a friend</option>
                {sortedMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {displayNameForMember(member)}
                    {member.id === user?.uid ? " (you)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.formActions}>
              <button
                className={styles.primaryButton}
                type="submit"
                disabled={!user || !isMember || attributes.length === 0 || members.length === 0}
              >
                Tag attribute
              </button>
              <p className={styles.formAside}>
                {autoAcceptPeerTags
                  ? "Peer tags auto-accept for now."
                  : "Friends approve tags that aren’t self-assigned."}
              </p>
            </div>
          </form>

          <div className={styles.tagColumns}>
            <div>
              <h3>Pending tags for you</h3>
              {user ? (
                pendingForUser.length > 0 ? (
                  <ul className={styles.pendingList}>
                    {pendingForUser.map((assignment) => {
                      const attribute = attributeMap.get(assignment.attributeId);
                      const requester = memberMap.get(assignment.assertedByUid);
                      const requesterName = requester
                        ? displayNameForMember(requester)
                        : "Someone";
                      return (
                        <li key={assignment.id}>
                          <div>
                            <strong>{attribute?.name ?? "Unknown"}</strong>
                            <p>Suggested by {requesterName}</p>
                            <p className={styles.timestamp}>{formatTimestamp(assignment.createdAt)}</p>
                          </div>
                          <div className={styles.pendingButtons}>
                            <button
                              className={styles.primaryButton}
                              type="button"
                              onClick={() => handleResolveAssertion(assignment.id, "accepted")}
                            >
                              Approve
                            </button>
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              onClick={() => handleResolveAssertion(assignment.id, "declined")}
                            >
                              Decline
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className={styles.empty}>Nothing pending right now.</p>
                )
              ) : (
                <p className={styles.empty}>Sign in to review pending tags.</p>
              )}
            </div>

            <div>
              <h3>Confirmed attributes</h3>
              {sortedMembers.length === 0 ? (
                <p className={styles.empty}>No members yet.</p>
              ) : (
                <ul className={styles.confirmedList}>
                  {sortedMembers.map((member) => {
                    const set = memberAttributeSet.get(member.id);
                    const confirmed = set
                      ? [...set].map((attributeId) => attributeMap.get(attributeId)?.name ?? "")
                      : [];
                    return (
                      <li key={member.id}>
                        <strong>{displayNameForMember(member)}</strong>
                        {confirmed.length > 0 ? (
                          <p>{confirmed.join(", ")}</p>
                        ) : (
                          <p className={styles.emptyInline}>No confirmed attributes yet.</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <header>
            <h2>Visualize overlaps</h2>
            <p className={styles.panelHint}>
              Toggle attributes above to explore intersections. Three or fewer attributes show a
              Venn-style breakdown. Four or more switch to an UpSet-inspired list of overlaps.
            </p>
          </header>

          {selection.length === 0 ? (
            <p className={styles.empty}>Select attributes to visualize the overlap map.</p>
          ) : selection.length <= 3 ? (
            <div className={styles.vennGrid}>
              {vennEntries.length > 0 ? (
                vennEntries.map(([key, bucketMembers]) => {
                  const ids = key.split("|");
                  const label = ids
                    .map((attrId) => attributeMap.get(attrId)?.name ?? "Unknown")
                    .join(" + ");
                  return (
                    <div key={key} className={styles.vennCell}>
                      <h3>{label}</h3>
                      <p className={styles.count}>
                        {bucketMembers.length} friend{bucketMembers.length === 1 ? "" : "s"}
                      </p>
                      <p className={styles.memberList}>
                        {bucketMembers.map((member) => displayNameForMember(member)).join(", ")}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className={styles.empty}>No overlaps yet. Approve a few tags to fill this in.</p>
              )}
            </div>
          ) : (
            <table className={styles.upsetTable}>
              <thead>
                <tr>
                  <th>Attributes combined</th>
                  <th>Friends in overlap</th>
                </tr>
              </thead>
              <tbody>
                {selectionDetails.length > 0 ? (
                  selectionDetails
                    .sort(
                      (a, b) => b.members.length - a.members.length || b.combo.length - a.combo.length
                    )
                    .map((entry) => {
                      const label = entry.combo
                        .map((attrId) => attributeMap.get(attrId)?.name ?? "Unknown")
                        .join(" + ");
                      return (
                        <tr key={entry.combo.join("|")}>
                          <td>{label}</td>
                          <td>
                            {entry.members.length}
                            {entry.members.length > 0 && (
                              <span className={styles.memberList}>
                                {" – "}
                                {entry.members.map((member) => displayNameForMember(member)).join(", ")}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan={2} className={styles.empty}>
                      No overlaps for this combination yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>

        <section className={styles.panel}>
          <header>
            <h2>Export matrix</h2>
            <p className={styles.panelHint}>
              Download the current member × attribute matrix as a CSV for safekeeping or further
              visualization experiments.
            </p>
          </header>
          <button className={styles.secondaryButton} type="button" onClick={handleExportCsv}>
            Export CSV
          </button>
        </section>
      </main>
    </>
  );
}

