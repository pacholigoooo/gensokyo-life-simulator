/* 三类为总概率；先抽类别，再在该类角色中等概率抽取。作者设定，可修改。 */
globalThis.TouhouConfig = Object.freeze({ordinary:0.95, main:0.0375, hifuu:0.00875, pc98:0.00375});

/* 以下是作者设定的条件概率与候选权重，并非人生结局配额。 */
globalThis.TouhouLifeConfig = Object.freeze({
 // 符合条件的年度机遇共抽一次；天赋亲和和已取得的妖术线索会增加发现率。
 opportunityChance:.002, opportunityMultiplier:55, livingOpportunityWeight:3,
 encounterChance:.18, relationshipChance:.04, contactChance:.045,
 romanceIntroWeight:3, romanceWishWeight:6, contactWishWeight:8, pc98RomanceWeight:.7,
 // 先抽有机会前往的来处，再完成通路和人物前置；这些权重不直接指定恋人。
 meetingLeadChance:.65, localLeadWeight:16, meetingVisitGap:14,
 meetingPreparationLimit:12, meetingPracticeLimit:4, meetingLeadYears:36,
 // 街坊初识与已发生的往来独立占一个年度事件，沿用实际相识、成年及伴侣条件。
 localMeetingChance:.004, youngMeetingChance:.018, youngNamedChance:.18, localProgressChance:.7,
 humanIntroMultiplier:2.5, humanEstablishedIntroAge:30, humanEstablishedIntroMultiplier:.6,
 humanContactMultiplier:2, humanBranchChance:.85, humanWaitLimit:1,
 humanMarriageYears:1, humanMarriageChance:.8,
 // 到实际商议婚事时，少数伴侣选择保持恋人关系；不是整局未婚配额。
 unwedCompanionshipChance:.035,
 // 独立恋爱入口适用此初识抽签；慧音、幽香沿用各自原图条件。
 mutualRomanceChance:.96, firstMeetingRomanceChance:.94,
 oldFriendRomanceChance:.8, oldFriendRomanceYears:6, introductionGap:5
});
