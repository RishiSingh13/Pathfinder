/**
 * Pure progress calculation logic according to Document 05 specifications:
 * - Calculate percentages strictly from active core topics: completed core topics / total active core topics
 * - 'already_know' counts toward core completion but is tracked distinctly
 * - Optional and stretch topics do not affect the core fraction denominator
 * - Expose clear fraction representation: e.g. "4 of 11 core topics"
 * - Estimated hours remaining calculated exclusively from incomplete core topics
 * - Deterministic resume precedence:
 *   1. Most recently touched in-progress topic by lastViewedAt
 *   2. Otherwise first incomplete core topic in canonical order
 *   3. If all core complete, first incomplete optional/stretch extension
 *   4. Otherwise all complete (resumeTopic = null)
 */

function calculateRoadmapProgress(topics = [], progressRecords = []) {
  const progressMap = new Map();
  progressRecords.forEach((record) => {
    progressMap.set(record.topicId.toString(), record);
  });

  const coreTopics = topics.filter((t) => t.type === 'core');
  const optionalTopics = topics.filter((t) => t.type === 'optional');
  const stretchTopics = topics.filter((t) => t.type === 'stretch');

  let completedCoreCount = 0;
  let studiedCoreCount = 0;
  let knownCoreCount = 0;
  let inProgressCount = 0;

  coreTopics.forEach((topic) => {
    const rec = progressMap.get(topic._id.toString());
    if (rec) {
      if (rec.status === 'completed') {
        completedCoreCount++;
        studiedCoreCount++;
      } else if (rec.status === 'already_know') {
        completedCoreCount++;
        knownCoreCount++;
      } else if (rec.status === 'in_progress') {
        inProgressCount++;
      }
    }
  });

  const totalCoreCount = coreTopics.length;
  const percentage = totalCoreCount > 0 ? Math.round((completedCoreCount / totalCoreCount) * 100) : 0;
  const fractionText = `${completedCoreCount} of ${totalCoreCount} core topics`;

  // Calculate remaining estimated hours from incomplete core topics
  const remainingCoreMinutes = coreTopics
    .filter((topic) => {
      const rec = progressMap.get(topic._id.toString());
      return !rec || (rec.status !== 'completed' && rec.status !== 'already_know');
    })
    .reduce((sum, topic) => sum + (topic.estimatedMinutes || 45), 0);

  const remainingHours = Number((remainingCoreMinutes / 60).toFixed(1));

  // Determine deterministic resume target
  // 1. Most recently touched in-progress topic
  const inProgressTopics = [];
  topics.forEach((topic) => {
    const rec = progressMap.get(topic._id.toString());
    if (rec && rec.status === 'in_progress') {
      inProgressTopics.push({
        topic,
        lastViewedAt: new Date(rec.lastViewedAt || rec.updatedAt || 0).getTime(),
      });
    }
  });

  let resumeTopic = null;
  let resumeReason = '';

  if (inProgressTopics.length > 0) {
    inProgressTopics.sort((a, b) => b.lastViewedAt - a.lastViewedAt);
    resumeTopic = inProgressTopics[0].topic;
    resumeReason = 'In progress — resume where you left off';
  } else {
    // 2. Otherwise first incomplete core topic in canonical roadmap order
    const firstIncompleteCore = coreTopics.find((topic) => {
      const rec = progressMap.get(topic._id.toString());
      return !rec || (rec.status !== 'completed' && rec.status !== 'already_know');
    });

    if (firstIncompleteCore) {
      resumeTopic = firstIncompleteCore;
      resumeReason = 'Next up in core curriculum';
    } else {
      // 3. All core complete! Recommend first incomplete optional or stretch topic
      const firstIncompleteExtension = [...optionalTopics, ...stretchTopics].find((topic) => {
        const rec = progressMap.get(topic._id.toString());
        return !rec || (rec.status !== 'completed' && rec.status !== 'already_know');
      });

      if (firstIncompleteExtension) {
        resumeTopic = firstIncompleteExtension;
        resumeReason = 'Core completed! Recommended extension';
      } else {
        resumeTopic = null;
        resumeReason = 'Roadmap completed!';
      }
    }
  }

  // Recently touched topics (up to 3)
  const recentlyTouched = [];
  topics.forEach((topic) => {
    const rec = progressMap.get(topic._id.toString());
    if (rec && rec.lastViewedAt) {
      recentlyTouched.push({
        topicId: topic._id,
        key: topic.key,
        title: topic.title,
        status: rec.status,
        lastViewedAt: rec.lastViewedAt,
        type: topic.type,
      });
    }
  });
  recentlyTouched.sort((a, b) => new Date(b.lastViewedAt) - new Date(a.lastViewedAt));

  return {
    percentage,
    fractionText,
    completedCoreCount,
    totalCoreCount,
    studiedCoreCount,
    knownCoreCount,
    inProgressCount,
    remainingMinutes: remainingCoreMinutes,
    remainingHours,
    isCompleted: totalCoreCount > 0 && completedCoreCount >= totalCoreCount,
    resumeTopic: resumeTopic
      ? {
          id: resumeTopic._id.toString(),
          key: resumeTopic.key,
          title: resumeTopic.title,
          type: resumeTopic.type,
          estimatedMinutes: resumeTopic.estimatedMinutes,
          buildsOnNote: resumeTopic.buildsOnNote || '',
        }
      : null,
    resumeReason,
    recentlyTouched: recentlyTouched.slice(0, 3),
  };
}

module.exports = { calculateRoadmapProgress };
