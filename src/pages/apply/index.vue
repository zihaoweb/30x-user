<template>
  <u-navbar autoBack title="申请与查看报告" placeholder border bgColor="#F2F5F9" />
  <div v-if="initPageData" class="px-24">
    <div class="m-t-24 flex-between">
      <div class="flex items-center">
        <div class="flex items-center" @click="openUserPopup">
          <div class="text-elli m-r-8 max-w-300 text-32 text-#4F95FF">
            {{ username }}
          </div>
          <up-icon name="arrow-down" size="small" :color="arrowDownColor" />
        </div>
      </div>
      <div class="flex items-center" @click="openFilterPopup">
        <img v-if="hasFilter" src="/static/report/filter-icon-active.png" alt="" class="h-32 w-32">
        <img v-else src="/static/report/filterIcon.png" alt="" class="h-32 w-32">
        <div class="m-l-10 text-32">
          筛选
        </div>
      </div>
    </div>
    <div class="tabs-wrap">
      <up-tabs
        :lineHeight="2" :activeStyle="{ color: '#4F95FF', fontSize: '28rpx' }" :lineWidth="42"
        :inactiveStyle="{ color: '#999999', fontSize: '28rpx' }"
        :lineColor="`${'#4F95FF'}`"
        :current="currentIndex" :list="tablist" :scrollable="false" @click="handleClickTabs"
      />
    </div>
    <scroll-view enable-flex="flexbox" scroll-y>
      <div v-if="currentIndex === 0 && allList!.length > 0">
        <div v-for="(item, index) in allList" :key="index" class="use-card m-t-24 box-border">
          <div class="m-b-16 flex-between lh-42">
            <div class="flex items-center">
              <img src="@/static/doctor/use-list-1.png" alt="" class="m-r-18 size-28">
              <div>{{ dayjs(Number(item.data_up_tm)).format('YYYY/MM/DD HH:mm:ss') }}</div>
            </div>
            <div v-if="item.urgent_status === '01'" class="text-#FF3F3F">
              已加急
            </div>
          </div>
          <u-line />
          <div class="m-t-16 flex-between lh-42">
            <div class="left-title">
              采集成员
            </div>
            <div class="right-title flex items-center">
              <div class="text-elli max-w-200">
                {{ item.patient_name }}
              </div> <span v-if="item.pat_deleted === 'Y'">(已删除)</span>
            </div>
          </div>
          <div class="m-t-16 flex-between lh-42">
            <div class="left-title">
              采集时长
            </div>
            <div class="right-title">
              {{ computedCollTime(item.duration) }}
            </div>
          </div>
          <div v-if="item.report_up_tm" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              解读医生
            </div>
            <div class="right-title">
              {{ item.doc_name }}
            </div>
          </div>
          <div v-if="item.report_up_tm" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              解读时间
            </div>
            <div class="right-title">
              {{ dayjs(Number(item.report_up_tm)).format('YYYY/MM/DD HH:mm:ss') }}
            </div>
          </div>
          <div v-if="item.report_up_tm" class="analy-tran relative m-t-16 flex-between">
            <div class="left-title">
              解读结果
            </div>
            <div
              class="right-title z-tag w-400"
              :class="{ 'text-elli': !item.isShowText }"
              :style="{ 'margin-right': item.remark.length > 13 ? '70rpx' : '0', 'text-align': item.remark.length > 13 ? 'left' : 'right' }"
            >
              {{ item.remark }}
              <div v-if="item.remark.length > 13" class="absolute right-0 top-0 flex items-center text-22 text-#4F95FF" @click="handleOpenText(index)">
                {{ item.isShowText ? '收起' : '展开' }}
                <up-icon v-if="!item.isShowText" name="arrow-down" :size="12" :color="`${'#4F95FF'}`" />
                <up-icon v-else name="arrow-up" :size="12" :color="`${'#4F95FF'}`" />
              </div>
            </div>
          </div>
          <div v-if="item.score_points" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              我的评分
            </div>
            <div class="right-title">
              {{ getScore(item.score_points) }}
            </div>
          </div>
          <div class="btn-wrap-analyzed m-t-16 flex items-center justify-end gap-16 lh-58">
            <div v-if="item.ai_report_id" class="left-btn-analyzed relative flex-center text-28" @click="checkAiReportDebounce(item.ai_report_id)">
              查看分析  <span v-if="item.ai_readed === 'N'" class="absolute right-12 top-0 text-24 text-#FF3F3F">新</span>
            </div>
            <div v-else-if="item.has_ai_report === 'Y'" class="left-btn-analyzing flex-center text-28">
              智能分析中...
            </div>
            <div v-else-if="item.time > 0 && item.once_status === '00'" class="left-btn flex-center text-28" @click="goPay(item)">
              继续支付 <up-count-down :time="item.time" format="mm:ss" @finish="handleFinish" />
            </div>
            <div v-else class="left-btn flex-center text-28" @click="applyAiDebounce(item.taskid, item.accid, item.pat_id)">
              申请智能分析
            </div>
            <div v-if="item.report_id" class="right-btn-analyzed relative flex-center text-28" @click="checkDocReportDebounce(item)">
              查看解读  <span v-if="item.has_report === 'Y' && item.readed !== 'Y'" class="absolute right-12 top-0 text-24 text-#FF3F3F">新</span>
            </div>
            <div v-else-if="item.has_report === 'N' && item.applied === 'Y'" class="right-btn-analyzing flex-center text-28">
              医生解读中...
            </div>
            <div v-else-if="item.time2 > 0 && item.urgent_status === '00'" class="right-btn flex-center text-28" @click="goPay2(item)">
              继续支付 <up-count-down :time="item.time2" format="mm:ss" @finish="handleFinish" />
            </div>
            <div v-else class="right-btn flex-center text-28" @click="clickDocApplyDebounce(item.taskid, item.accid, item.pat_deleted, item.pat_id)">
              申请医生解读
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="currentIndex === 1 && docList!.length > 0">
        <div v-for="(item, index) in docList" :key="index" class="use-card m-t-24 box-border">
          <div class="m-b-16 flex-between lh-42">
            <div class="flex items-center">
              <img src="@/static/doctor/use-list-1.png" alt="" class="m-r-18 size-28">
              <div>{{ dayjs(Number(item.data_up_tm)).format('YYYY/MM/DD HH:mm:ss') }}</div>
            </div>
            <div v-if="item.urgent_status === '01'" class="text-#FF3F3F">
              已加急
            </div>
          </div>
          <u-line />
          <div class="m-t-16 flex-between lh-42">
            <div class="left-title">
              采集成员
            </div>
            <div class="right-title flex items-center">
              <div class="text-elli max-w-200">
                {{ item.patient_name }}
              </div> <span v-if="item.pat_deleted === 'Y'">(已删除)</span>
            </div>
          </div>
          <div class="m-t-16 flex-between lh-42">
            <div class="left-title">
              采集时长
            </div>
            <div class="right-title">
              {{ computedCollTime(item.duration) }}
            </div>
          </div>
          <div v-if="item.report_up_tm" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              解读医生
            </div>
            <div class="right-title">
              {{ item.doc_name }}
            </div>
          </div>
          <div v-if="item.report_up_tm" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              解读时间
            </div>
            <div class="right-title">
              {{ dayjs(Number(item.report_up_tm)).format('YYYY/MM/DD HH:mm:ss') }}
            </div>
          </div>
          <div v-if="item.report_up_tm" class="analy-tran relative m-t-16 flex-between">
            <div class="left-title">
              解读结果
            </div>
            <div
              class="z-tag right-title w-400"
              :class="{ 'text-elli': !item.isShowText }"
              :style="{ 'margin-right': item.remark.length > 13 ? '70rpx' : '0', 'text-align': item.remark.length > 13 ? 'left' : 'right' }"
            >
              {{ item.remark }}
              <div v-if="item.remark.length > 13" class="absolute right-0 top-0 flex items-center text-22 text-#4F95FF" @click="handleOpenTextofDoc(index)">
                {{ item.isShowText ? '收起' : '展开' }}
                <up-icon v-if="!item.isShowText" name="arrow-down" :size="12" :color="`${'#4F95FF'}`" />
                <up-icon v-else name="arrow-up" :size="12" :color="`${'#4F95FF'}`" />
              </div>
            </div>
          </div>
          <div v-if="item.score_points" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              我的评分
            </div>
            <div class="right-title">
              {{ getScore(item.score_points) }}
            </div>
          </div>
          <div class="btn-wrap-analyzed m-t-16 flex items-center justify-end gap-16 lh-58">
            <div v-if="item.ai_report_id" class="left-btn-analyzed relative flex-center text-28" @click="checkAiReportDebounce(item.ai_report_id)">
              查看分析  <span v-if="item.ai_readed === 'N'" class="absolute right-12 top-0 text-24 text-#FF3F3F">新</span>
            </div>
            <div v-else-if="item.has_ai_report === 'Y'" class="left-btn-analyzing flex-center text-28">
              智能分析中...
            </div>
            <div v-else-if="item.time > 0 && item.once_status === '00'" class="left-btn flex-center text-28" @click="goPay(item)">
              继续支付 <up-count-down :time="item.time" format="mm:ss" @finish="handleFinish" />
            </div>
            <div v-else class="left-btn flex-center text-28" @click="applyAiDebounce(item.taskid, item.accid, item.pat_id)">
              申请智能分析
            </div>
            <div v-if="item.report_id" class="right-btn-analyzed relative flex-center text-28" @click="checkDocReportDebounce(item)">
              查看解读  <span v-if="item.has_report === 'Y' && item.readed !== 'Y'" class="absolute right-12 top-0 text-24 text-#FF3F3F">新</span>
            </div>
            <div v-else-if="item.has_report === 'N' && item.applied === 'Y'" class="right-btn-analyzing flex-center text-28">
              医生解读中...
            </div>
            <div v-else-if="item.time2 > 0 && item.urgent_status === '00'" class="right-btn flex-center text-28" @click="goPay2(item)">
              继续支付 <up-count-down :time="item.time2" format="mm:ss" @finish="handleFinish" />
            </div>
            <div v-else class="right-btn flex-center text-28" @click="clickDocApplyDebounce(item.taskid, item.accid, item.pat_deleted, item.pat_id)">
              申请医生解读
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="currentIndex === 2 && aiList!.length > 0">
        <div v-for="(item, index) in aiList" :key="index" class="use-card m-t-24 box-border">
          <div class="m-b-16 flex-between lh-42">
            <div class="flex items-center">
              <img src="@/static/doctor/use-list-1.png" alt="" class="m-r-18 size-28">
              <div>{{ dayjs(Number(item.data_up_tm)).format('YYYY/MM/DD HH:mm:ss') }}</div>
            </div>
            <div v-if="item.urgent_status === '01'" class="text-#FF3F3F">
              已加急
            </div>
          </div>
          <u-line />
          <div class="m-t-16 flex-between lh-42">
            <div class="left-title">
              采集成员
            </div>
            <div class="right-title flex items-center">
              <div class="text-elli max-w-200">
                {{ item.patient_name }}
              </div> <span v-if="item.pat_deleted === 'Y'">(已删除)</span>
            </div>
          </div>
          <div class="m-t-16 flex-between lh-42">
            <div class="left-title">
              采集时长
            </div>
            <div class="right-title">
              {{ computedCollTime(item.duration) }}
            </div>
          </div>
          <div v-if="item.report_up_tm" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              解读医生
            </div>
            <div class="right-title">
              {{ item.doc_name }}
            </div>
          </div>
          <div v-if="item.report_up_tm" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              解读时间
            </div>
            <div class="right-title">
              {{ dayjs(Number(item.report_up_tm)).format('YYYY/MM/DD HH:mm:ss') }}
            </div>
          </div>
          <div v-if="item.report_up_tm" class="analy-tran relative m-t-16 flex-between">
            <div class="left-title">
              解读结果
            </div>
            <div
              class="z-tag right-title w-400"
              :class="{ 'text-elli': !item.isShowText }"
              :style="{ 'margin-right': item.remark.length > 13 ? '70rpx' : '0', 'text-align': item.remark.length > 13 ? 'left' : 'right' }"
            >
              {{ item.remark }}
              <div v-if="item.remark.length > 13" class="absolute right-0 top-0 flex items-center text-22 text-#4F95FF" @click="handleOpenTextOfAi(index)">
                {{ item.isShowText ? '收起' : '展开' }}
                <up-icon v-if="!item.isShowText" name="arrow-down" :size="12" :color="`${'#4F95FF'}`" />
                <up-icon v-else name="arrow-up" :size="12" :color="`${'#4F95FF'}`" />
              </div>
            </div>
          </div>
          <div v-if="item.score_points" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              我的评分
            </div>
            <div class="right-title">
              {{ getScore(item.score_points) }}
            </div>
          </div>
          <div class="btn-wrap-analyzed m-t-16 flex items-center justify-end gap-16 lh-58">
            <div v-if="item.ai_report_id" class="left-btn-analyzed relative flex-center text-28" @click="checkAiReportDebounce(item.ai_report_id)">
              查看分析  <span v-if="item.ai_readed === 'N'" class="absolute right-12 top-0 text-24 text-#FF3F3F">新</span>
            </div>
            <div v-else-if="item.has_ai_report === 'Y'" class="left-btn-analyzing flex-center text-28">
              智能分析中...
            </div>
            <div v-else-if="item.time > 0 && item.once_status === '00'" class="left-btn flex-center text-28" @click="goPay(item)">
              继续支付 <up-count-down :time="item.time" format="mm:ss" @finish="handleFinish" />
            </div>
            <div v-else class="left-btn flex-center text-28" @click="applyAiDebounce(item.taskid, item.accid, item.pat_id)">
              申请智能分析
            </div>
            <div v-if="item.report_id" class="right-btn-analyzed relative flex-center text-28" @click="checkDocReportDebounce(item)">
              查看解读  <span v-if="item.has_report === 'Y' && item.readed !== 'Y'" class="absolute right-12 top-0 text-24 text-#FF3F3F">新</span>
            </div>
            <div v-else-if="item.has_report === 'N' && item.applied === 'Y'" class="right-btn-analyzing flex-center text-28">
              医生解读中...
            </div>
            <div v-else-if="item.time2 > 0 && item.urgent_status === '00'" class="right-btn flex-center text-28" @click="goPay2(item)">
              继续支付 <up-count-down :time="item.time2" format="mm:ss" @finish="handleFinish" />
            </div>
            <div v-else class="right-btn flex-center text-28" @click="clickDocApplyDebounce(item.taskid, item.accid, item.pat_deleted, item.pat_id)">
              申请医生解读
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="w-full flex-center">
          <img src="/static/images/empty.png" alt="" class="size-480">
        </div>
        <div class="text-center text-39 text-#999999">
          暂无报告
        </div>
      </div>
      <div class="emptyEle" />
    </scroll-view>
  </div>
  <div v-else class="px-24">
    <up-loading-page :loading="true" />
  </div>

  <!-- 资料未完善 -->
  <z-model
    :show="applyFailModel" confirmText="去完善" :cancelText="hiddenUpdateUserInfoBtn ? '取消' : '我知道了'" title="解读失败" :is-show-confirm="hiddenUpdateUserInfoBtn"
    icon="close-circle-fill" iconColor="#FF3F3F"
    @confirm="goToEdit" @close="() => { applyFailModel = false }" @cancel="() => { applyFailModel = false }"
  >
    <template #default>
      <div class="m-b-40 m-t-24 text-center text-28 text-#666666">
        该成员个人资料未完善，无法申请报告
      </div>
    </template>
  </z-model>

  <!-- 两人都未购买人工智能分析服务 -->
  <z-model
    :show="bothNotServiceModel" confirmText="购买服务" title="解读失败" :cancelText="`单次申请${onceAiPrice}元`"
    icon="close-circle-fill" iconColor="#FF3F3F"
    @confirm="goToBuyAi" @close="() => { bothNotServiceModel = false }" @cancel="applyAiOnce"
  >
    <template #default>
      <div class="m-b-40 m-t-24 text-center text-28 text-#666666">
        您和他都未购买人工智能分析服务
      </div>
    </template>
  </z-model>

  <!-- 两人都未购买医生解读服务 -->
  <z-model
    :show="bothNotDocServiceModel" confirmText="购买服务" title="解读失败" cancel-text="我知道了"
    icon="close-circle-fill" iconColor="#FF3F3F"
    @confirm="goToBuyDoc" @close="() => { bothNotDocServiceModel = false }" @cancel="() => { bothNotDocServiceModel = false }"
  >
    <template #default>
      <div class="m-b-40 m-t-24 text-center text-28 text-#666666">
        您和他都未购买医生解读分析服务
      </div>
    </template>
  </z-model>

  <!-- 未购买人工智能分析服务 -->
  <z-model
    :show="applyAiOnceModel" confirmText="购买服务" :cancelText="`单次申请${onceAiPrice}元`" title="申请智能分析失败"
    icon="close-circle-fill" iconColor="#FF3F3F"
    @confirm="goToBuyAi" @cancel="applyAiOnce" @close="() => { applyAiOnceModel = false }"
  >
    <template #default>
      <div v-if="aiExpiredTag" class="m-b-40 m-t-24 text-center text-28 text-#666666">
        您购买的智能分析服务已过期!
      </div>
      <div v-else class="m-b-40 m-t-24 text-center text-28 text-#666666">
        您尚未购买智能分析服务!
      </div>
    </template>
  </z-model>

  <z-model
    :show="applyDocFailModel" confirmText="购买服务" cancelText="我知道了" title="申请医生解读失败"
    icon="close-circle-fill" iconColor="#FF3F3F"
    @confirm="goToBuyDoc" @cancel="() => { applyDocFailModel = false }" @close="() => { applyDocFailModel = false }"
  >
    <template #default>
      <div class="m-b-40 m-t-24 text-center text-28 text-#666666">
        您尚未购买医生解读服务
      </div>
    </template>
  </z-model>

  <z-model
    :show="applyAiAndFollowModel" confirmText="购买服务" :cancelText="`单次申请${onceAiPrice}元`" title="申请智能分析失败"
    icon="close-circle-fill" iconColor="#FF3F3F"
    @confirm="goToBuyAi" @cancel="applyAiOnce" @close="() => { applyAiAndFollowModel = false }"
  >
    <template #default>
      <div class="m-b-40 m-t-24 text-center text-28 text-#666666">
        关注账户和您都尚未购买智能分析服务
      </div>
    </template>
  </z-model>

  <z-model
    :show="applyDocModel" confirmText="常规申请" :cancelText="`加急申请+${onceDocPrice}元`" title="申请报告"
    @close="() => { applyDocModel = false }" @confirm="applyDoctor" @cancel="buyOnceDocService"
  >
    <template #default>
      <div class="m-b-40 m-t-24 text-center text-28 text-#666666">
        是否需要医生出具一份解读报告
      </div>
    </template>
  </z-model>

  <!-- 未购买 使用你的DOC权益进行申请 useOtherDocServiceModel -->
  <z-model
    :show="useOtherDocServiceModel" confirmText="常规申请" :cancelText="`加急申请+${onceDocPrice}元`" title="申请医生解读失败"
    icon="close-circle-fill" iconColor="#FF3F3F"
    @confirm="applyDocOfOther" @cancel="buyOnceDocService" @close="() => { useOtherDocServiceModel = false }"
  >
    <template #default>
      <div class="m-b-40 m-t-24 text-center text-28 text-#666666">
        该家庭未购买医生解读服务, 是否使用您的医生解读服务进行申请?
        <!-- 若该家庭没有医生解读次数，将默认使用您的次数进行申请 -->
      </div>
    </template>
  </z-model>

  <z-model
    :show="notFull10MinModel" confirmText="常规申请" :cancelText="`加急申请+${onceDocPrice}元`" title="申请报告"
    icon="close-circle-fill" iconColor="#FF3F3F"
    @close="() => { notFull10MinModel = false }" @confirm="applyDoctor" @cancel="buyOnceDocService"
  >
    <template #default>
      <div class="m-b-40 m-t-24 text-center text-28 text-#666666">
        采集时长不足 <span class="text-#FF3F3F">10分钟</span>，长时间的心电采集更容易捕捉心脏异常
      </div>
    </template>
  </z-model>

  <z-model
    :show="applyDocResModel" confirmText="好的" :isShowCancel="false" title="申请医生解读报告成功"
    icon="checkmark-circle-fill" iconColor="#2FC465"
    @close="() => { applyDocResModel = false }" @confirm="() => { applyDocResModel = false }"
  >
    <template #default>
      <div class="m-t-56" />
    </template>
  </z-model>
  <!-- 评分 evaluateModel -->
  <z-model
    :show="evaluateModel" confirmText="提交" cancelText="取消" :title="`你对${doctorFirstName}医生的报告满意吗？`"
    @close="() => { evaluateModel = false }" @confirm="evaluate" @cancel="() => { evaluateModel = false }"
  >
    <template #default>
      <div class="padding-40 m-b-40 m-t-24 flex-center">
        <Rate v-model:rating="evaluatePoints" :maxStars="5" />
      </div>
    </template>
  </z-model>
  <!-- downloadimgPopup -->
  <up-popup :customStyle="customStyle" :show="downloadimgPopup" :round="10" mode="center">
    <div class="box-border wh-full flex-col p-t-40">
      <div class="m-b-24 m-b-80 text-center text-36 text-#4F95FF">
        正在打开文件
      </div>
      <z-progress :progress="progress" />
      <div class="m-t-40 text-center text-30 text-#999999">
        文件较大，请耐心等待~
      </div>
    </div>
  </up-popup>

  <z-popup
    title="筛选" :show="filterPop" cancelText="清除" confirmText="完成"
    :mt="218" @close="() => { filterPop = false }" @confirm="filterConfirm" @cancel="filterCancel"
  >
    <template #default>
      <div class="m-t-24 box-border h-80 flex items-center justify-between px-24 text-32 text-#2F384C">
        <div class="text-#2F384C">
          仅看有报告
        </div>

        <div @click="onlyReport = !onlyReport">
          <up-icon v-if="onlyReport" name="checkmark-circle-fill" :color="arrowDownColor" />
          <up-icon v-else name="checkmark-circle" :color="arrowDownColor" />
        </div>
      </div>
      <up-line color="#DCDCDC" />
      <div class="m-b-16 m-t-40 box-border px-24 text-32 text-#2F384C">
        采集时长
      </div>
      <div class="m-b-16 box-border flex items-center px-24">
        <up-icon name="clock" :color="arrowDownColor" :size="14" />
        <span class="m-l-8 text-28" :class="startHour ? 'text-color' : 'un-text-color'" @click="openHourPopup(0)">
          {{ startHour ? `${startHour}小时` : '请选择...' }}
        </span>
        <span class="mx-16 text-28 text-#2F384C">至</span>
        <up-icon name="clock" :color="arrowDownColor" :size="14" />
        <span class="m-l-8 text-28" :class="endHour ? 'text-color' : 'un-text-color'" @click="openHourPopup(1)">
          {{ endHour ? `${endHour}小时` : '请选择...' }}
        </span>
      </div>
      <up-line color="#DCDCDC" />
      <div class="m-b-16 m-t-40 box-border px-24 text-32 text-#2F384C">
        上传时间
      </div>
      <div class="m-b-16 box-border flex items-center px-24">
        <up-icon name="clock" :color="arrowDownColor" :size="14" />
        <span class="m-l-8 text-28" :class="startDate ? 'text-color' : 'un-text-color'" @click="openDatePopup(0)">
          {{ startDate ? dayjs(startDate).format('YYYY/MM/DD HH:mm') : '请选择...' }}
        </span>
        <span class="mx-16 text-28 text-#2F384C">至</span>
        <up-icon name="clock" :color="arrowDownColor" :size="14" />
        <span class="m-l-8 text-28" :class="endDate ? 'text-color' : 'un-text-color'" @click="openDatePopup(1)">
          {{ endDate ? dayjs(endDate).format('YYYY/MM/DD HH:mm') : '请选择...' }}
        </span>
      </div>
      <up-line color="#DCDCDC" />
    </template>
  </z-popup>

  <!-- 选择家庭 -->
  <z-popup
    :show="userPopup"
    :mt="221"
    title="选择家庭"
    @confirm="userPopupConfirm"
    @close="() => { userPopup = false }"
    @cancel="() => { userPopup = false }"
  >
    <template #default>
      <div class="grid-container m-t-56">
        <div class="grid-item relative" :class="{ active: chooseSelf }" @click="handleChooseSelf">
          <div class="flex items-center">
            <div class="my-tag flex-center">
              我的
            </div>
            <div class="m-r-8 size-48">
              <img v-if="avatarurl" :src="avatarurl" alt="" class="wh-full" :style="{ borderRadius: '8rpx' }">
              <up-avatar v-else :size="24" url="" shape="square" />
            </div>
            <div class="flex">
              <div class="text-elli max-w-220 text-32 primary-color">
                {{ myusername }}
              </div>
            </div>
          </div>
        </div>
        <div v-for="(item, index) in memberList" :key="item.create_tm" class="grid-item" :class="{ active: index === activeUserIndex }" @click="activeUser(index)">
          <div class="flex items-center">
            <div class="m-r-8 size-48">
              <img v-if="item.followed_avatarUrl" :src="item.followed_avatarUrl" alt="" class="wh-full" :style="{ borderRadius: '8rpx' }">
              <up-avatar v-else :size="24" url="" shape="square" />
            </div>
            <div class="flex">
              <div class="text-elli max-w-220 text-32 primary-color">
                {{ item.followed_name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </z-popup>

  <up-picker :show="filterTimePicker" :columns="columns" @confirm="filterHourConfirm" @cancel="filterHourCancel" />
  <up-datetime-picker
    v-model="curDate"
    :minDate="minDate"
    :maxDate="maxDate"
    :show="filterDatePicker"
    @confirm="filterDateConfirm"
    @cancel="filterDateCancel"
  />
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import {
  applyAiReport,
  applyDoctorReport,
  getReportList,
  setReportRead,
  setReportReadOfDoctor,
} from '@/api/report';
import { debounce } from '@/utils';
import { getFollowList } from '@/api/follow';
import useServiceStore from '@/store/service';
import type { FollowListResult } from '@/api/follow/types';
import type { IPayParams } from '@/api/service/doctor/types';
import { buyOnceAi, getOnceAiPrice } from '@/api/service/ai';
import { buyDoctorServiceOfUrgent, getOnceDocPrice, reportEvaluate } from '@/api/service/doctor';
import type { ApplyDoctorReportParams, IReportParams, IReportResult } from '@/api/report/types';

const serviceStore = useServiceStore();

const curDate = ref(Date.now());
const currentIndex = ref<number>(0);

const arrowDownColor = ref('#4F95FF');
const maxDate = ref(dayjs().valueOf());
const chooseSelf = ref<boolean>(false);
const minDate = ref(dayjs().subtract(5, 'year').hour(0).minute(0).second(0).valueOf());
const columns = reactive([
  [0, 2, 6, 10, 24, 48, 72],
]);
const tablist = ref([
  { name: '全部' },
  { name: '医生解读' },
  { name: '智能分析 ' },
]);
const customStyle = {
  width: '70%',
  height: '350rpx',
};

const aiList = ref<IReportResult[]>([]); // 智能分析
const allList = ref<IReportResult[]>([]); // 全部记录
const docList = ref<IReportResult[]>([]); // 医生解读

const hasFilter = ref<boolean>(false); // 是否有筛选
const aiExpiredTag = ref<boolean>(false); // 自动申请智能解读服务过期
const notSelf = ref<boolean>(false); // 是否正在查看自己报告
const filterPop = ref<boolean>(false); // 筛选
const userPopup = ref<boolean>(false); // 选择家庭POP
const onlyReport = ref<boolean>(false); // 只看有报告
const initPageData = ref<boolean>(false); // 初始化页面数据
const applyDocModel = ref<boolean>(false); // 申请医生报告
const evaluateModel = ref<boolean>(false); // 评分
const applyFailModel = ref<boolean>(false); // 该成员资料未完善
const filterTimePicker = ref<boolean>(false); // 筛选时间
const filterDatePicker = ref<boolean>(false); // 筛选日期
const applyDocResModel = ref<boolean>(false); // 申请医生报告成功
const downloadimgPopup = ref<boolean>(false); // 下载pdf报告model
const applyAiOnceModel = ref<boolean>(false);
const notFull10MinModel = ref<boolean>(false);
const applyDocFailModel = ref<boolean>(false);
const bothNotServiceModel = ref<boolean>(false); // 两人Ai服务都没有
const applyAiAndFollowModel = ref<boolean>(false);
const bothNotDocServiceModel = ref<boolean>(false); // 两人Doc服务都没有
const useOtherDocServiceModel = ref<boolean>(false);
const hiddenUpdateUserInfoBtn = ref<boolean>(false); // 替别人申请报告时,此人的信息未完善, 隐藏替去完善资料按钮

const updateUserInfoUuid = ref<string>(''); // 申请报告时,此人的uuid 在未完善的时候
const patId = ref<string>(''); // 成员id
const endHour = ref<string>('');
const startHour = ref<string>('');
const applyTaskId = ref<string>(''); // 正在申请的报告任务id
const diagnosed_by = ref<string>(''); // 医生id
const doctorFirstName = ref<string>(''); // 出报告医生的性
const evaluateRecordId = ref<string>(''); // 评分报告id
const applyAiOfOtherUuid = ref<string>(''); // 代替申请人的uuid
const applyDocOfOtherUuid = ref<string>(''); // 代替申请人的uuid
const avatarurl = ref<string>(uni.getStorageSync('avatarurl')); // 当前家庭的头像
const username = ref<string>(uni.getStorageSync('nickname')); // 当前家庭的用户名
const myusername = ref<string>(uni.getStorageSync('nickname'));

const onceAiPrice = ref<number>(0); // ai一次报告价格
const onceDocPrice = ref<number>(0); // doc一次报告价格
const pageNo = ref<number>(1); // 页码
const endDate = ref<number>(0); // 筛选报告的结束时间
const progress = ref<number>(0); // 下载进度
const hourtype = ref<number>(0);
const dateType = ref<number>(0);
const pageSize = ref<number>(10); // 每页条数
const startDate = ref<number>(0); // 筛选报告的开始时间
const evaluatePoints = ref<number>(0); // 评分
const activeUserIndex = ref<number>(0); // 当前选中的家庭

const memberList = ref<FollowListResult[]>([]); // 家庭列表

const openUserPopup = () => {
  if (!memberList.value.length) {
    uni.showToast({ title: '暂无可查看的家庭~', icon: 'none' });
    return;
  }
  userPopup.value = true;
};

const handleClickTabs = async ({ index }: { index: number }) => {
  // uni.showLoading({ title: '加载中...', mask: true });
  if (currentIndex.value === index)
    return;
  allList.value = [];
  docList.value = [];
  aiList.value = [];
  pageNo.value = 1;
  let type: string | undefined;
  if (index === 0) {
    type = undefined;
    currentIndex.value = index;
  }
  else if (index === 1) {
    onlyReport.value = false;
    type = 'DOC';
    currentIndex.value = index;
  }
  else if (index === 2) {
    onlyReport.value = false;
    type = 'AI';
    currentIndex.value = index;
  }
  if (notSelf.value) {
    await init({
      type,
      follow_create_tm: memberList.value[activeUserIndex.value].create_tm,
      data_up_time: endDate.value > 0 ? [`${startDate.value}`, `${endDate.value}`] : undefined,
      coll_duration: endHour.value ? [startHour.value, endHour.value] : undefined,
    }, applyDocOfOtherUuid.value, true, type);
  }
  else {
    await init({
      type,
      data_up_time: endDate.value > 0 ? [`${startDate.value}`, `${endDate.value}`] : undefined,
      coll_duration: endHour.value ? [startHour.value, endHour.value] : undefined,
    }, '', true, type);
  }
};

const init = async (params: Partial<IReportParams> = {}, uuid: string = '', isRefresh: boolean = true, type: string = '') => {
  if (isRefresh) {
    pageNo.value = 1;
  }
  const data = {
    accid: uuid || uni.getStorageSync('uuid'),
    attention_id: uni.getStorageSync('uuid'),
    pageno: pageNo.value,
    pagecnt: pageSize.value,
    ...params,
  };
  const res = await getReportList(data);
  console.log('getReportList', res);
  uni.hideLoading();
  initPageData.value = true;
  if (res.length === 0 && !isRefresh) {
    // pageNo.value = pageNo.value - 1;
    uni.showToast({
      title: '没有数据了~',
      icon: 'none',
    });
    return;
  }

  res.forEach((item: IReportResult) => {
    item.isShowText = false;
    item.time = item.timeout_duration * 60 * 1000 - (item.current_tm - Number(item.once_create_tm));
    item.time2 = item.timeout_duration * 60 * 1000 - (item.current_tm - Number(item.urgent_create_tm));
  });

  if (isRefresh) {
    if (type === 'AI') {
      aiList.value = res;
    }
    else if (type === 'DOC') {
      docList.value = res;
    }
    else {
      allList.value = res;
    }
  }
  else {
    if (type === 'AI') {
      aiList.value.push(...res);
    }
    else if (type === 'DOC') {
      docList.value.push(...res);
    }
    else {
      allList.value.push(...res);
    }
  }
};

onReachBottom(async () => {
  pageNo.value += 1;
  console.log('pageNo', pageNo.value);
  let type: string | undefined;
  if (currentIndex.value === 0) {
    type = undefined;
  }
  else if (currentIndex.value === 1) {
    onlyReport.value = false;
    type = 'DOC';
  }
  else if (currentIndex.value === 2) {
    onlyReport.value = false;
    type = 'AI';
  }
  if (notSelf.value) {
    await init({
      type,
      follow_create_tm: memberList.value[activeUserIndex.value].create_tm,
      data_up_time: endDate.value > 0 ? [`${startDate.value}`, `${endDate.value}`] : undefined,
      coll_duration: endHour.value ? [startHour.value, endHour.value] : undefined,
    }, applyDocOfOtherUuid.value, false, type);
  }
  else {
    await init({
      type,
      data_up_time: endDate.value > 0 ? [`${startDate.value}`, `${endDate.value}`] : undefined,
      coll_duration: endHour.value ? [startHour.value, endHour.value] : undefined,
    }, '', false, type);
  }
});

const userPopupConfirm = async () => {
  startHour.value = '';
  endHour.value = '';
  hourtype.value = 0;
  startDate.value = 0;
  endDate.value = 0;
  dateType.value = 0;
  if (activeUserIndex.value === 10) {
    username.value = uni.getStorageSync('nickname');
    userPopup.value = false;
    applyDocOfOtherUuid.value = '';
    await init();
    return;
  }
  const { followed_id, followed_name } = memberList.value[activeUserIndex.value];
  username.value = followed_name;
  userPopup.value = false;

  await init(
    {
      follow_create_tm: memberList.value[activeUserIndex.value].create_tm,
    },
    followed_id,
  );
  notSelf.value = true;
  applyDocOfOtherUuid.value = followed_id;
};

onShow(async () => {
  if (uni.getStorageSync('evaluation')) {
    evaluateModel.value = true;
    uni.removeStorageSync('evaluation');
  }
  const res = await getOnceAiPrice();
  const docOncePrice = await getOnceDocPrice();
  onceAiPrice.value = res[0].now_price;
  onceDocPrice.value = docOncePrice[0].now_price;
});

onMounted(async () => {
  if (notSelf.value) {
    await init({ follow_create_tm: memberList.value[activeUserIndex.value].create_tm }, applyDocOfOtherUuid.value);
  }
  else {
    await init();
  }
  notSelf.value = false;
  const res = await getFollowList({
    acc_id: uni.getStorageSync('uuid'),
    type: 'dg',
  });
  memberList.value = res;
  aiExpiredTag.value = !!serviceStore.getAi;
});

const handleChooseSelf = async () => {
  chooseSelf.value = true;
  activeUserIndex.value = 10;
  notSelf.value = false;
};

const openFilterPopup = () => {
  filterPop.value = true;
};

// 筛选
const filterConfirm = async () => {
  if (startHour.value || endHour.value) {
    if (!startHour.value || !endHour.value) {
      uni.showToast({ icon: 'none', title: '请选择完整的时间段' });
      return;
    }
    if (Number(startHour.value) >= Number(endHour.value)) {
      uni.showToast({ icon: 'none', title: '采集开始时间不能大于等于结束时间' });
      return;
    }
  }
  if (startDate.value || endDate.value) {
    if (!startDate.value || !endDate.value) {
      uni.showToast({ icon: 'none', title: '请选择完整的日期' });
      return;
    }
    if (startDate.value >= endDate.value) {
      uni.showToast({ icon: 'none', title: '采集开始日期不能大于等于结束日期' });
      return;
    }
  }
  let type: string | undefined;
  if (currentIndex.value === 0) {
    type = undefined;
    aiList.value = [];
  }
  else if (currentIndex.value === 1) {
    onlyReport.value = false;
    aiList.value = [];
    type = 'DOC';
  }
  else if (currentIndex.value === 2) {
    onlyReport.value = false;
    aiList.value = [];
    type = 'AI';
  }
  if (notSelf.value) {
    await init({
      type,
      follow_create_tm: memberList.value[activeUserIndex.value].create_tm,
      data_up_time: endDate.value > 0 ? [`${startDate.value}`, `${endDate.value}`] : undefined,
      coll_duration: endHour.value ? [startHour.value, endHour.value] : undefined,
    }, applyDocOfOtherUuid.value, true, type);
  }
  else {
    await init({
      type,
      data_up_time: endDate.value > 0 ? [`${startDate.value}`, `${endDate.value}`] : undefined,
      coll_duration: endHour.value ? [startHour.value, endHour.value] : undefined,
    }, '', true, type);
  }
  if (startDate.value || startHour.value || onlyReport.value) {
    hasFilter.value = true;
  }
  filterPop.value = false;
};

const computedCollTime = (time: number) => {
  const hours = Math.floor(time / 3600); // 小时
  const minutes = Math.floor((time % 3600) / 60); // 分钟
  if (hours === 0) {
    return `${minutes}分钟`;
  }
  return `${hours}小时${minutes}分钟`;
};

// 查看Ai报告
const checkAiReport = async (id: string) => {
  const url = `${import.meta.env.VITE_APP_BASE_API}/bu/ai/ai-${id}`;
  console.log('文件不存在', url);
  uni.downloadFile({
    url,
    timeout: 60000,
    filePath: `${wx.env.USER_DATA_PATH}/ai-${id}`,
    success(res) {
      // 10.28 延迟0.5秒打开
      setTimeout(() => {
        wx.openDocument({
          filePath: res.filePath!, // 本地文档路径
          fileType: 'pdf', // 文档类型
          showMenu: true,
          async success() {
            const report = await setReportRead(id, uni.getStorageSync('uuid'));
            allList.value!.forEach((item: IReportResult) => {
              if (item.ai_report_id === id) {
                item.ai_readed = 'Y';
              }
            });
            aiList.value!.forEach((item: IReportResult) => {
              if (item.ai_report_id === id) {
                item.ai_readed = 'Y';
              }
            });
            docList.value!.forEach((item: IReportResult) => {
              if (item.ai_report_id === id) {
                item.ai_readed = 'Y';
              }
            });

            console.log('检查ai报告', report);
            if (report) {
              console.log('打开文件成功');
              // .showToast({ icon: 'none', title: '打开文件成功' });
            }
          },
          fail() {
            console.log('打开文件失败');
            // uni.showToast({ icon: 'none', title: '打开文件失败' });
          },
        });
      }, 500);
    },
    fail: (err) => {
      console.log('下载失败', err);
      uni.showToast({ icon: 'none', title: '下载失败,请检查网络或者稍后再试' });
      // downloadTask.abort();
    },
  });
};

const checkAiReportDebounce = debounce(checkAiReport, 300);

// 评分
const evaluate = async () => {
  const data: any = {
    doc_id: diagnosed_by.value,
    report_id: evaluateRecordId.value,
    pat_id: patId.value,
    points: evaluatePoints.value,
  };
  await reportEvaluate(data);
  evaluateModel.value = false;
  if (notSelf.value) {
    await init({ follow_create_tm: memberList.value[activeUserIndex.value].create_tm }, applyDocOfOtherUuid.value);
  }
  else {
    await init();
  }
};

// 继续支付ai-once订单
const goPay = async (item: IReportResult) => {
  const uuid = uni.getStorageSync('uuid');
  if (item.once_payer !== uuid) {
    return uni.showToast({ icon: 'none', title: `${item.once_nickname}正在支付中,请刷新页面重试!`, duration: 3000 });
  }
  const payDocParam: Partial<IPayParams> = {
    payer: uuid,
    openid: uni.getStorageSync('openid'),
    appid: 'wxd3c75fd54416963d',
    tradeno: item.tradeno,
    description: `单次服务${item.taskid}`,
    amount: `${onceAiPrice.value}`,
    quantity: '1',
  };
  let res = await buyOnceAi(payDocParam);
  console.log('支付', res);
  if (res.payment) {
    res = res.payment;
  }
  if (res) {
    wx.requestPayment({
      provider: 'wxpay', // 支付类型-固定值
      timeStamp: res.timeStamp, // 时间戳（单位：秒）
      nonceStr: res.nonceStr, // 随机字符串
      package: res.package, // 固定值
      signType: res.signType, // 固定值
      paySign: res.paySign, // 签名
      success() {
        openSubscribeMsg();
      },
    });
  }
};

// 继续支付医生加急订单
const goPay2 = async (item: IReportResult) => {
  const uuid = uni.getStorageSync('uuid');
  if (item.urgent_payer !== uuid) {
    return uni.showToast({ icon: 'none', title: `${item.urgent_nickname}正在支付中,请刷新页面重试!`, duration: 3000 });
  }
  const payDocParam: IPayParams = {
    payer: uni.getStorageSync('uuid'),
    openid: uni.getStorageSync('openid'),
    appid: 'wxd3c75fd54416963d',
    tradeno: item.urgent_tradeno,
    description: `医生加急${item.taskid}`,
    amount: `${onceDocPrice.value}`,
    quantity: '1',
  };
  let res = await buyDoctorServiceOfUrgent(payDocParam);
  console.log('buyDoctorServiceOfUrgent', res);
  if (res.payment) {
    res = res.payment;
  }
  if (res) {
    wx.requestPayment({
      provider: 'wxpay', // 支付类型-固定值
      timeStamp: res.timeStamp, // 时间戳（单位：秒）
      nonceStr: res.nonceStr, // 随机字符串
      package: res.package, // 固定值
      signType: res.signType, // 固定值
      paySign: res.paySign, // 签名
      async success() {
        const data: ApplyDoctorReportParams = {
          consumer: notSelf.value ? applyDocOfOtherUuid.value : uni.getStorageSync('uuid'),
          taskid: item.taskid,
          app: '30x',
          openid: uni.getStorageSync('openid'),
          attention_id: notSelf.value ? uni.getStorageSync('uuid') : '',
        };
        await applyDoctorReport(data);
        openSubscribeMsg();
      },
    });
  }
};

// 查看医生报告
const checkDocReport = (item: IReportResult) => {
  const { report_id: id, has_report, readed, doc_name, diagnosed_by: docid, pat_id } = item;
  patId.value = pat_id;
  if (!notSelf.value && has_report === 'Y' && doc_name) {
    diagnosed_by.value = docid;
    evaluateRecordId.value = id;
    doctorFirstName.value = doc_name.slice(0, 1);
    if (readed !== 'Y') {
      uni.setStorageSync('evaluation', id);
    }
  }
  downloadimgPopup.value = true;
  // 文件不存在或其他错误
  const url = `${import.meta.env.VITE_APP_BASE_API}/bu/${id}`;
  const downloadTask = uni.downloadFile({
    url, // pdf链接
    timeout: 60000,
    filePath: `${wx.env.USER_DATA_PATH}/${id}`,
    success(res) {
      // 10.28 延迟0.5秒打开
      setTimeout(() => {
        wx.openDocument({
          // 打开文档
          filePath: res.filePath!, // 本地文档路径
          fileType: 'pdf', // 文档类型
          showMenu: true,
          async success() {
            const report = await setReportReadOfDoctor(id, uni.getStorageSync('uuid'));
            allList.value!.forEach((item: IReportResult) => {
              if (item.report_id === id) {
                item.readed = 'Y';
              }
            });
            docList.value!.forEach((item: IReportResult) => {
              if (item.report_id === id) {
                item.readed = 'Y';
              }
            });
            aiList.value!.forEach((item: IReportResult) => {
              if (item.report_id === id) {
                item.readed = 'Y';
              }
            });
            if (report) {
              // uni.showToast({ icon: 'none', title: '打开文件成功' });
              console.log('检查医生报告', report);
            }
          },
          fail(err) {
            console.log('打开失败', err);
            // uni.showToast({ icon: 'none', title: '下载失败' });
          },
          complete: () => {
            downloadimgPopup.value = false;
          },
        });
      }, 500);
    },
    fail: (err) => {
      console.log('下载失败', err);
      uni.showToast({ icon: 'none', title: '下载失败,请检查网络或者稍后再试' });
      // downloadTask.abort();
    },
  });
  downloadTask.onProgressUpdate((res: any) => {
    progress.value = res.progress;
  });
};

const checkDocReportDebounce = debounce(checkDocReport, 300);

// 代替申请医生解读
const applyDocOfOther = async () => {
  useOtherDocServiceModel.value = false;
  console.log(applyTaskId.value);
  const data: ApplyDoctorReportParams = {
    consumer: applyDocOfOtherUuid.value,
    taskid: applyTaskId.value,
    app: '30x',
    openid: uni.getStorageSync('openid'),
    attention_id: uni.getStorageSync('uuid'),
    is_apply: 'Y',
  };
  const { code, key } = await applyDoctorReport(data);
  // if (code === 'NG') {
  //   switch (key) {
  //     case 1:
  //       uni.showToast({ icon: 'none', title: '当前数据已申请报告~', duration: 3000 });
  //       if (notSelf.value) {
  //         await init({ follow_create_tm: memberList.value[activeUserIndex.value].create_tm }, applyDocOfOtherUuid.value);
  //       }
  //       else {
  //         await init();
  //       }
  //       break;
  //     case 2:
  //       applyDocFailModel.value = true;
  //       break;
  //     case 4:
  //       bothNotDocServiceModel.value = true;
  //       break;
  //     case 7:
  //       uni.showToast({ icon: 'none', title: '对方已将你删除~' });
  //       notSelf.value = false;
  //       await init();
  //       memberList.value = await getFollowList({
  //         acc_id: uni.getStorageSync('uuid'),
  //         type: 'dg',
  //       });
  //       break;
  //     default:
  //       uni.showToast({ icon: 'none', title: '申请失败,请稍后再试~' });
  //       break;
  //   }
  // }
  if (code === 'NG') {
    switch (key) {
      case 1:
        uni.showToast({ icon: 'none', title: '当前数据已申请报告~', duration: 3000 });
        if (notSelf.value) {
          await init({ follow_create_tm: memberList.value[activeUserIndex.value].create_tm }, applyDocOfOtherUuid.value);
        }
        else {
          await init();
        }
        break;
      case 2:
        useOtherDocServiceModel.value = true;
        break;
      case 3:
        bothNotDocServiceModel.value = true;
        break;
      case 6:
        hiddenUpdateUserInfoBtn.value = !notSelf.value;
        updateUserInfoUuid.value = applyDocOfOtherUuid.value;
        applyFailModel.value = true; // 资料未完善
        break;
      case 7:
        uni.showToast({ icon: 'none', title: '对方已将你删除~' });
        notSelf.value = false;
        await init();
        memberList.value = await getFollowList({
          acc_id: uni.getStorageSync('uuid'),
          type: 'dg',
        });
        break;
      case 8:
        useOtherDocServiceModel.value = true;
        break;
      default:
        uni.showToast({ icon: 'none', title: '申请失败,请稍后再试~' });
        break;
    }
  }
  else {
    await init({ follow_create_tm: memberList.value[activeUserIndex.value].create_tm }, applyDocOfOtherUuid.value);
    applyDocResModel.value = true;
  }
};

// 打开订阅消息
const openSubscribeMsg = (uuid: string = '') => {
  uni.getSetting({
    withSubscriptions: true,
    success(res) {
      if (!res.subscriptionsSetting.mainSwitch) {
        uni.showModal({
          title: '是否重新授权消息订阅功能',
          success(res) {
            if (res.confirm) {
              uni.openSetting({
                success(res) {
                  if (res.subscriptionsSetting) {
                    uni.showToast({ icon: 'none', title: '开启权限成功' });
                  }
                },
                fail() {
                  uni.showToast({ icon: 'none', title: '开启权限失败' });
                },
              });
            }
            else {
              uni.showToast({ icon: 'none', title: '拒绝开启开启权限' });
            }
          },
        });
      }
      else {
        uni.requestSubscribeMessage({
          tmplIds: ['7RueK7NHqmFW9UZHYsQ8uVLgkFCOCl5G_SLSMaNaio4'],
          success(res) {
            console.log('订阅消息成功', res);
          },
          fail(err) {
            console.log('订阅消息失败', err);
          },
          async complete() {
            if (notSelf.value) {
              await init({ follow_create_tm: memberList.value[activeUserIndex.value].create_tm }, uuid || applyDocOfOtherUuid.value);
            }
            else {
              await init();
            }
          },
        });
      }
    },
  });
};

// 申请AI解析
const applyAi = async (taskId: string, accid: string = '', patid: string = '') => {
  applyTaskId.value = taskId;
  applyAiOfOtherUuid.value = accid;
  const data: any = {
    applicant: notSelf.value ? applyAiOfOtherUuid.value : uni.getStorageSync('uuid'),
    taskid: taskId,
    app: '30x',
    openid: uni.getStorageSync('openid'),
    attention_id: notSelf.value ? uni.getStorageSync('uuid') : '',
  };
  const { code, key } = await applyAiReport(data);
  console.log('applyAiReport', 'code', code, 'key', key);
  if (code === 'NG') {
    switch (key) {
      case 1:
      case 3:
        applyAiOnceModel.value = true;
        aiExpiredTag.value = false;
        break;
      case 2:
        bothNotServiceModel.value = true;
        break;
      case 4:
        updateUserInfoUuid.value = patid;
        hiddenUpdateUserInfoBtn.value = !notSelf.value;
        applyFailModel.value = true;
        break;
      case 8:
        uni.showToast({ icon: 'none', title: '对方已将你删除~' });
        notSelf.value = false;
        await init();
        memberList.value = await getFollowList({
          acc_id: uni.getStorageSync('uuid'),
          type: 'dg',
        });
        break;
      default:
        uni.showToast({ icon: 'none', title: '申请失败,请稍后再试~' });
        break;
    }
  }
  else {
    openSubscribeMsg(applyAiOfOtherUuid.value);
  }
};

const clickDocApply = async (taskId: string, accid: string = '', del: string = '', patid: string = '') => {
  if (del === 'Y') {
    uni.showToast({ icon: 'none', title: '当前成员已被删除' });
    return;
  }
  applyTaskId.value = taskId;
  applyDocOfOtherUuid.value = accid;
  const data = {
    consumer: notSelf.value ? accid : uni.getStorageSync('uuid'),
    taskid: taskId,
    app: '30x',
    openid: uni.getStorageSync('openid'),
    attention_id: notSelf.value ? uni.getStorageSync('uuid') : '',
    is_check: 'Y',
  };
  const { code, key } = await applyDoctorReport(data);

  console.log('applyDoctorReport', 'code', code, 'key', key);
  if (code === 'NG') {
    switch (key) {
      case 1:
        uni.showToast({ icon: 'none', title: '当前数据已申请报告~', duration: 3000 });
        if (notSelf.value) {
          await init({ follow_create_tm: memberList.value[activeUserIndex.value].create_tm }, accid);
        }
        else {
          await init();
        }
        break;
      case 2:
        if (notSelf.value) {
          useOtherDocServiceModel.value = true;
        }
        else {
          applyDocFailModel.value = true;
        }
        break;
      case 3:
        bothNotDocServiceModel.value = true;
        break;
      case 6:
        hiddenUpdateUserInfoBtn.value = !notSelf.value;
        updateUserInfoUuid.value = patid;
        applyFailModel.value = true; // 资料未完善
        break;
      case 7:
        uni.showToast({ icon: 'none', title: '对方已将你删除~' });
        notSelf.value = false;
        await init();
        memberList.value = await getFollowList({
          acc_id: uni.getStorageSync('uuid'),
          type: 'dg',
        });
        break;
      case 8:
        useOtherDocServiceModel.value = true;
        break;
      default:
        uni.showToast({ icon: 'none', title: '申请失败,请稍后再试~' });
        break;
    }
  }
  else {
    applyDocModel.value = true;
  }
};

const applyAiDebounce = debounce(applyAi, 500);

const clickDocApplyDebounce = debounce(clickDocApply, 500);

// 申请医生报告
const applyDoctor = async () => {
  useOtherDocServiceModel.value = false;
  applyDocModel.value = false;
  notFull10MinModel.value = false;
  const data: ApplyDoctorReportParams = {
    consumer: notSelf.value ? applyDocOfOtherUuid.value : uni.getStorageSync('uuid'),
    taskid: applyTaskId.value,
    app: '30x',
    openid: uni.getStorageSync('openid'),
    attention_id: notSelf.value ? uni.getStorageSync('uuid') : '',
  };
  const { code, key } = await applyDoctorReport(data);
  console.log('code', code, 'key', key);
  if (code === 'NG') {
    switch (key) {
      case 1:
        uni.showToast({ icon: 'none', title: '当前数据已申请报告~', duration: 3000 });
        if (notSelf.value) {
          await init({ follow_create_tm: memberList.value[activeUserIndex.value].create_tm }, applyDocOfOtherUuid.value);
        }
        else {
          await init();
        }
        break;
      case 2:
        if (notSelf.value) {
          useOtherDocServiceModel.value = true;
        }
        else {
          applyDocFailModel.value = true;
        }
        break;
      case 3:
        bothNotDocServiceModel.value = true;
        break;
      case 6:
        hiddenUpdateUserInfoBtn.value = !notSelf.value;
        updateUserInfoUuid.value = applyDocOfOtherUuid.value;
        applyFailModel.value = true; // 资料未完善
        break;
      case 7:
        uni.showToast({ icon: 'none', title: '对方已将你删除~' });
        notSelf.value = false;
        await init();
        memberList.value = await getFollowList({
          acc_id: uni.getStorageSync('uuid'),
          type: 'dg',
        });
        break;
      case 8:
        useOtherDocServiceModel.value = true;
        break;
      default:
        uni.showToast({ icon: 'none', title: '申请失败,请稍后再试~' });
        break;
    }
  }
  else {
    openSubscribeMsg();
    applyDocResModel.value = true;
  }
};

const goToEdit = () => {
  applyFailModel.value = false;
  uni.navigateTo({ url: `/pages/member/updateMember?uuid=${updateUserInfoUuid.value}&mobile=${uni.getStorageSync('mobile')}` });
};

// 申请AI单次
const applyAiOnce = async () => {
  const data: IPayParams = {
    payer: uni.getStorageSync('uuid'),
    openid: uni.getStorageSync('openid'),
    appid: 'wxd3c75fd54416963d',
    description: `单次服务${applyTaskId.value}`,
    amount: `${onceAiPrice.value}`,
    quantity: '1',
  };
  const res = await buyOnceAi(data);
  console.log('buyOnceAi', res);
  if (res.code === 'NG') {
    switch (res.key) {
      case 1:
        uni.showToast({ icon: 'none', title: '当前数据已申请报告~', duration: 3000 });
        if (notSelf.value) {
          await init({ follow_create_tm: memberList.value[activeUserIndex.value].create_tm }, applyDocOfOtherUuid.value);
        }
        else {
          await init();
        }
        break;
      case 2:
        applyDocFailModel.value = true; // 未购买套餐
        break;
      case 3:
        bothNotDocServiceModel.value = true; // 两人都未购买套餐
        break;
      case 6:
        hiddenUpdateUserInfoBtn.value = !notSelf.value;
        applyFailModel.value = true; // 资料未完善
        break;
      case 7:
        uni.showToast({ icon: 'none', title: '对方已将你删除~' });
        notSelf.value = false;
        await init();
        memberList.value = await getFollowList({
          acc_id: uni.getStorageSync('uuid'),
          type: 'dg',
        });
        break;
      default:
        uni.showToast({ icon: 'none', title: '申请失败,请稍后再试~' });
        break;
    }
  }
  else {
    wx.requestPayment({
      provider: 'wxpay', // 支付类型-固定值
      timeStamp: res.payment.timeStamp, // 时间戳（单位：秒）
      nonceStr: res.payment.nonceStr, // 随机字符串
      package: res.payment.package, // 固定值
      signType: res.payment.signType, // 固定值
      paySign: res.payment.paySign, // 签名
      async success() {
        openSubscribeMsg();
        uni.showToast({ icon: 'none', title: '支付成功' });
        applyAiOnceModel.value = false;
        bothNotServiceModel.value = false;
      },
      async fail(err) {
        if (notSelf.value) {
          await init({ follow_create_tm: memberList.value[activeUserIndex.value].create_tm }, applyDocOfOtherUuid.value);
        }
        else {
          await init();
        }
        applyAiOnceModel.value = false;
        bothNotServiceModel.value = false;
        console.log('支付失败', err);
      },
    });
  }
};

const goToBuyAi = () => {
  applyAiOnceModel.value = false;
  uni.navigateTo({ url: '/pages/service/ai/index' });
};

const goToBuyDoc = () => {
  applyDocFailModel.value = false;
  bothNotDocServiceModel.value = false;
  uni.navigateTo({ url: '/pages/service/doctor/index' });
};

// 购买单次医生加急服务
const buyOnceDocService = async () => {
  useOtherDocServiceModel.value = false;
  const payDocParam: IPayParams = {
    payer: uni.getStorageSync('uuid'),
    openid: uni.getStorageSync('openid'),
    appid: 'wxd3c75fd54416963d',
    description: `医生加急${applyTaskId.value}`,
    amount: `${onceDocPrice.value}`,
    quantity: '1',
    beneficiary_id: notSelf.value ? applyDocOfOtherUuid.value : '',
  };
  const res = await buyDoctorServiceOfUrgent(payDocParam);
  console.log('buyDoctorServiceOfUrgent', res);
  if (res.code === 'NG') {
    switch (res.key) {
      case 1:
        hiddenUpdateUserInfoBtn.value = !notSelf.value;
        applyDocModel.value = false;
        applyFailModel.value = true; // 资料未完善
        break;
      case 2:
        uni.showToast({
          icon: 'none',
          title: '当前报告正在申请中,请稍后~',
          duration: 2000,
        });
        break;
      default:
        console.log('购买失败');
        break;
    }
  }
  else {
    wx.requestPayment({
      provider: 'wxpay', // 支付类型-固定值
      timeStamp: res.payment.timeStamp, // 时间戳（单位：秒）
      nonceStr: res.payment.nonceStr, // 随机字符串
      package: res.payment.package, // 固定值
      signType: res.payment.signType, // 固定值
      paySign: res.payment.paySign, // 签名
      async success() {
        const data: ApplyDoctorReportParams = {
          consumer: notSelf.value ? applyDocOfOtherUuid.value : uni.getStorageSync('uuid'),
          taskid: applyTaskId.value,
          app: '30x',
          openid: uni.getStorageSync('openid'),
          attention_id: notSelf.value ? uni.getStorageSync('uuid') : '',
        };
        await applyDoctorReport(data);
        openSubscribeMsg();
        applyDocModel.value = false;
        console.log('支付成功');
      },
      async fail(err) {
        if (notSelf.value) {
          await init({ follow_create_tm: memberList.value[activeUserIndex.value].create_tm }, applyDocOfOtherUuid.value);
        }
        else {
          await init();
        }
        applyDocModel.value = false;
        console.log('支付失败', err);
      },
    });
  }
};

const filterCancel = () => {
  startHour.value = '';
  endHour.value = '';
  hourtype.value = 0;
  startDate.value = 0;
  endDate.value = 0;
  dateType.value = 0;
  onlyReport.value = false;
  hasFilter.value = false;
};

const filterHourConfirm = ({ value }: any) => {
  console.log('筛选完成', value);
  if (hourtype.value === 0) {
    startHour.value = `${value[0]}`;
  }
  else if (hourtype.value === 1) {
    endHour.value = `${value[0]}`;
  }
  filterTimePicker.value = false;
  filterPop.value = true;
};

const filterHourCancel = () => {
  filterTimePicker.value = false;
  filterPop.value = true;
};

const openHourPopup = (type: number) => {
  hourtype.value = type;
  filterTimePicker.value = true;
  filterPop.value = false;
};

const filterDateConfirm = ({ value }: any) => {
  console.log('筛选完成', value);
  if (dateType.value === 0) {
    startDate.value = value;
  }
  else if (dateType.value === 1) {
    endDate.value = value;
  }
  filterDatePicker.value = false;
  filterPop.value = true;
};

// 倒计时结束
const handleFinish = async () => {
  // await init();
  if (notSelf.value) {
    await init({ follow_create_tm: memberList.value[activeUserIndex.value].create_tm }, applyDocOfOtherUuid.value);
  }
  else {
    await init();
  }
};

// 展开医生解读详情
const handleOpenText = (index: number) => {
  allList.value![index].isShowText = !allList.value![index].isShowText;
};

const getScore = (score: string) => {
  switch (score) {
    case '1':
      return '非常差';
    case '2':
      return '差';
    case '3':
      return '一般';
    case '4':
      return '满意';
    case '5':
      return '非常满意';
    default:
      return '';
  }
};

const handleOpenTextofDoc = (index: number) => {
  docList.value![index].isShowText = !docList.value![index].isShowText;
};
const handleOpenTextOfAi = (index: number) => {
  aiList.value![index].isShowText = !aiList.value![index].isShowText;
};

// 选中家庭的下标
const activeUser = (index: number) => {
  chooseSelf.value = false;
  activeUserIndex.value = index;
};

const filterDateCancel = () => {
  filterDatePicker.value = false;
  filterPop.value = true;
};

const openDatePopup = (type: number) => {
  dateType.value = type;
  filterDatePicker.value = true;
  filterPop.value = false;
};
</script>

<style scoped lang='scss'>
:deep(.u-count-down__text) {
  color: #FD7F18 !important;
}
.my-tag{
  background-color: rgba(79, 149, 255, 0.10);
  color: #4F95FF;
  padding: 5rpx 10rpx;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 24rpx;
}
.reset-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding:4rpx 8rpx;
  margin-left: 16rpx;
  font-size: 26rpx;
  color: #4F95FF;
  border: 2rpx solid #4F95FF;
  border-radius: 8rpx;
}

.grid-container{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;

  .grid-item{
    padding: 24rpx;
    width: 100%;
    background: #F2F5F9;
    border: 2rpx solid #DCDCDC;
    border-radius: 8rpx;
    box-shadow: 0rpx 8rpx 16rpx 0rpx rgb(79 149 255 / 20%);
    box-sizing: border-box;
  }

  .active {
    background: #FFF;
    border: 2rpx solid #4F95FF;
  }
}

.left-btn-analyzing{
  width: 216rpx;
  height: 58rpx;
  color: #999;
  background: #F2F5F9;
  border-radius: 8rpx;
}

.right-btn-analyzing{
  width: 216rpx;
  height: 58rpx;
  color: #999;
  background: #F2F5F9;
  border-radius: 8rpx;
}

.left-btn{
  width: 216rpx;
  height: 58rpx;
  color: white;
  background: linear-gradient( 136deg, #4BD5DF 0%, #2FC49F 100%);
  border-radius: 8rpx;
}

.right-btn{
  width: 216rpx;
  height: 58rpx;
  color: white;
  background: linear-gradient( 138deg, #4FD3FF 0%, #4F95FF 100%);
  border-radius: 8rpx;
}

.left-btn-analyzed{
  width: 216rpx;
  height: 58rpx;
  color: rgb(61 204 191);
  border: 1px solid;
  // border: linear-gradient(136deg, rgba(75, 213, 223, 1), rgba(46, 195, 158, 1)) 2 2;
  border-color: rgb(61 204 191);
  border-radius: 8rpx;
  box-sizing: border-box;
}

.right-btn-analyzed{
  width: 216rpx;
  height: 58rpx;
  color: rgb(78 179 255);
  border: 1px solid;
  // border: linear-gradient(138deg, rgba(78, 210, 255, 1), rgba(78, 149, 255, 1)) 2 2;
  border-color: rgb(78 179 255);
  border-radius: 8rpx;
  box-sizing: border-box;
}

.emptyEle{
  width: 100%;
  height: 88rpx;
}

.tabs-wrap::after{
  display: block;
  margin-top: -3px;
  width: 100%;
  height: 1px;
  background-color: #ccc;
  content: '';
}

.use-card {
  padding: 24rpx;
  width: 100%;
  background: linear-gradient( 180deg, rgb(239 246 255 / 90%) 0%, #FFF 100%);
  border-radius: 0rpx 0rpx 16rpx 16rpx;
  box-sizing: border-box;
  border-top: 1rpx solid #4F95FF;

  .left-title{
    height: 42rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #999;
    line-height: 42rpx;
  }

  .right-title{
    font-weight: 400;
    font-size: 28rpx;
    color: #2F384C;
  }
}

.text-color {
  color: #4F95FF;
}

.un-text-color {
  color: #999;
}
</style>
