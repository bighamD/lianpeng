<template>
  <div v-if="activityData && activityPeriod" class="page">
    <!-- banner -->
    <div class="banner-box">
      <van-swipe class="my-swipe" indicator-color="#13D1B5" :autoplay="5000">
        <van-swipe-item v-for="(item, index) in activityData.banner" :key="'banner' + index">
          <van-image class="cover-path" :src="item" fit="cover" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="details-box">
      <div class="activity-title">{{ activityPeriod.name ? activityPeriod.name : activityData.name }}</div>
      <div class="activity-info">
        <div v-if="activityData.is_only_vip === 1" class="info-l">
          <span class="money">¥{{ activityPeriod.vip_money }}</span>
          <span class="vip-status">会员专享活动</span>
        </div>
        <div v-else class="info-l">
          <span class="money">{{ activityPeriod.money == 0 ? '免费' : '¥' + activityPeriod.money }}</span>
          <span v-if="activityPeriod.vip_money != activityPeriod.money" class="unit">/人{{ activityPeriod.vip_money ? '(VIP:¥' + activityPeriod.vip_money + ')' : '' }}</span>
        </div>
        <div class="info-r" @click="onFavorites()">
          <van-icon v-if="isFavorites == 0" name="like-o" class="icon-like" />
          <van-icon v-else name="like" class="icon-like" />
          {{ activityData.favorites_count }}人想去
        </div>
      </div>
      <div class="activity-introduce">
        <span class="introduce-title">风景</span>
        <span v-for="item in activityData.d_level" :key="'level' + item">★</span>
        <span v-for="item in 5 - activityData.d_level" :key="'level1' + item">☆</span>
        {{ activityData.d_name }}
      </div>
      <div class="activity-introduce">
        <span class="introduce-title">集合</span>{{ activityData.assembling_place }}
      </div>
    </div>
    <div v-if="activityData.is_only_vip === 1 && userData.vip === 0" class="vip-box" @click="onJump('vip')">
      <div class="vip-l"><svg-icon slot="hint" icon-class="hint" class="icon-hint" />会员专享活动，该活动仅会员可参加</div>
      <div class="vip-r">立即开通会员></div>
    </div>
    <div v-else-if="activityData.is_only_vip != 1 && userData.vip === 0 && (activityPeriod.vip_money != activityPeriod.money) && activityPeriod.money != 0" class="vip-box" @click="onJump('vip')">
      <div class="vip-l"><svg-icon slot="hint" icon-class="hint" class="icon-hint" />开通会员，报名可省{{ activityPeriod.money - activityPeriod.vip_money }}元</div>
      <div class="vip-r">立即开通></div>
    </div>
    <div class="time-box">
      <div class="time-title">选择时间</div>
      <van-radio-group ref="wrapper" v-model="period" class="time-list" @change="getPeriod">
        <div ref="cont" class="list-box">
          <van-radio v-for="(item, index) in activityData.period" :key="'time' + index" :name="item.id" class="time-item">
            <template #icon="props">
              <div v-if="item.tag" class="time-hint">{{ item.tag }}</div>
              <div :class="['item-box', props.checked ? 'time-select' : '']">
                <div class="time-val">
                  {{ item.start_time | timeFilers }}<span class="small">{{ item.start_time | starFilers }}</span>~ {{ item.end_time | timeFilers }}
                </div>
                <div v-if="item.this_member_number === activityData.max_number && !item.period_status" class="apply-count finish">已满员 | {{ item.this_member_number }}人</div>
                <div v-else-if="item.this_member_number >= activityData.min_number && !item.period_status" class="apply-count residue">已成行 | 剩{{ activityData.max_number - item.this_member_number }}个名额</div>
                <div v-else-if="!item.period_status" class="apply-count">火热报名中</div>
                <div v-else class="apply-count period">报名已截止</div>
                <span v-if="props.checked" class="checke-bg" />
                <svg-icon v-if="props.checked" slot="yes" icon-class="yes" class="icon-checked" />
              </div>
            </template>
          </van-radio>
        </div>
      </van-radio-group>
    </div>
    <div v-if="activityMember" class="user-box">
      <div class="user-title" @click="onJumpUser()">
        <span>已参加的人（{{ activityPeriod.min_number }}人以上成行）</span>
        <span class="count">总共{{ activityPeriod.yet_join_number }}/{{ activityPeriod.max_number }}<van-icon name="arrow" /></span>
      </div>
      <div class="user-list">
        <div v-for="(item, index) in activityGuide" :key="'guide' + index" class="user-item">
          <svg-icon slot="lead" icon-class="lead" class="icon-lead" />
          <van-image class="avatar-img" :src="item.headimgurl" fit="cover" round />
          <div class="user-name">{{ item.nickname }}</div>
        </div>
        <div v-for="(item, index) in activityMember" :key="'member' + index" class="user-item">
          <div v-if="item.join_number > 1" class="team-count">{{ item.join_number }}</div>
          <van-image class="avatar-img" :src="item.headimgurl" fit="cover" round />
          <div class="user-name">{{ item.nickname }}</div>
        </div>
      </div>
    </div>
    <div class="content-box">
      <van-tabs v-model="active" color="#13D1B5" title-active-color="#13D1B5" line-height="2px" @change="tabChange">
        <van-tab title="活动详情">
          <div v-if="activityPeriod" class="tab-box" v-html="activityPeriod.explain_detail" />
        </van-tab>
        <van-tab title="行程与准备">
          <div v-if="activityPeriod" class="tab-box" v-html="activityPeriod.explain_journey" />
        </van-tab>
        <van-tab title="费用说明">
          <div v-if="activityPeriod" class="tab-box" v-html="activityPeriod.explain_expenses" />
        </van-tab>
        <van-tab v-if="activityComment.length >= 10" :title="'评价(' + activityData.comment.comment_sum + ')'">
          <div class="tab-box">
            <div class="score-box">
              <div class="score-all">
                <div class="all-title">综合评星</div>
                <div class="all-val">{{ activityData.comment.score }}</div>
                <van-rate v-model="activityData.comment.score" class="all-rate-star" size="13px" color="#f08223" gutter="4px" allow-half readonly />
                <div class="all-count">{{ activityData.comment.comment_sum }}人评分</div>
              </div>
              <div class="score-list">
                <div class="score-item">
                  <span class="score-item-title">五星</span>
                  <div class="score-item-progress">
                    <div class="progress" :style="'width:' + activityData.comment.level_5 + '%'" />
                  </div>
                  <span class="score-item-percentage">{{ activityData.comment.level_5 }}%</span>
                </div>
                <div class="score-item">
                  <span class="score-item-title">四星</span>
                  <div class="score-item-progress">
                    <div class="progress" :style="'width:' + activityData.comment.level_4 + 'px'" />
                  </div>
                  <span class="score-item-percentage">{{ activityData.comment.level_4 }}%</span>
                </div>
                <div class="score-item">
                  <span class="score-item-title">三星</span>
                  <div class="score-item-progress">
                    <div class="progress" :style="'width:' + activityData.comment.level_3 + 'px'" />
                  </div>
                  <span class="score-item-percentage">{{ activityData.comment.level_3 }}%</span>
                </div>
                <div class="score-item">
                  <span class="score-item-title">二星</span>
                  <div class="score-item-progress">
                    <div class="progress" :style="'width:' + activityData.comment.level_2 + 'px'" />
                  </div>
                  <span class="score-item-percentage">{{ activityData.comment.level_2 }}%</span>
                </div>
                <div class="score-item">
                  <span class="score-item-title">一星</span>
                  <div class="score-item-progress">
                    <div class="progress" :style="'width:' + activityData.comment.level_1 + 'px'" />
                  </div>
                  <span class="score-item-percentage">{{ activityData.comment.level_1 }}%</span>
                </div>
              </div>
            </div>
            <div class="comment-title">最新评价</div>
            <div class="comment-box">
              <div class="comment-list">
                <div v-for="(item, index) in activityComment" :key="'comment' + index" class="comment-item">
                  <div class="user-info">
                    <van-image class="avatar-img" :src="item.headimgurl" fit="cover" round />
                    <div class="user-name">{{ item.nickname }}</div>
                  </div>
                  <div class="comment-info">
                    <div class="comment-content">{{ item.comment }}</div>
                    <van-rate v-model="item.level" class="comment-rate-star" size="15px" color="#f08223" gutter="4px" allow-half readonly />
                    <div class="order-info">{{ item.start_time | timeFilers }}出发 领队：{{ item.guide }}</div>
                  </div>
                </div>
              </div>
              <div v-show="false" class="comment-more">加载更多评论</div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="footer-box">
      <div class="footer-item" @click="onJump('index')">
        <svg-icon slot="index" icon-class="index" class="icon-footer" />
        <span class="footer-item-text">活动</span>
      </div>
      <div class="footer-item" @click="onJump('userActivity')">
        <svg-icon slot="order" icon-class="order" class="icon-footer" />
        <span class="footer-item-text">订单</span>
      </div>
      <div class="footer-item" @click="showCode = true">
        <svg-icon slot="service" icon-class="service" class="icon-footer" />
        <span class="footer-item-text">咨询</span>
      </div>
      <!-- 活动状态(0报名中1已满员2已开始3已结束4未成行)  -->
      <div v-if="activityPeriod.period_status == 0" class="apply-btn" @click="enroll()">立即报名</div>
      <div v-else-if="activityPeriod.period_status == 1" class="apply-btn small-btn" @click="showInform = true">已满员，有名额时通知我</div>
      <div v-else class="apply-btn gary-btn">{{ activityPeriod.period_status | periodFilers }}</div>
    </div>
    <van-popup v-model="showCode" :close-on-click-overlay="false">
      <div v-if="activityData" class="popup-box">
        <img :src="activityData.qr_code" class="code-path">
        <div class="code-hint">长按二维码，咨询活动</div>
        <van-icon name="close" class="icon-close" @click="showCode = false" />
      </div>
    </van-popup>
    <!-- 通知弹窗  -->
    <van-popup v-model="showInform">
      <div class="inform-box">
        <div class="inform-title">开启活动名额通知</div>
        <p class="reb">本活动有名额时将允许工作人员联系通知您</p>
        <p>ps：收到有名额通知后请在本系统报名，请勿私自给任何人转账付款及发送个人资料。</p>
        <div class="inform-btns">
          <div class="inform-close" @click="showInform = false">取消</div>
          <div class="inform-allow" @click="inform">允许</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Tab, Tabs, Image, Icon, Radio, RadioGroup, Rate, Swipe, SwipeItem, Toast, Popup } from 'vant'
import BScroll from 'better-scroll' // 导入better-scroll
import { getActivityDetail, getActivityPeriod, getActivityComment, checkFavorites, favorites, notice, getActivityShare } from '@/api/activity'
import { getWeek } from '@/utils/index'
import wxApi from '@/utils/wxApi'
import { pastDue } from '@/utils/index'

export default {
  name: 'ActivityDetails',
  components: {
    [Tab.name]: Tab,
    [Image.name]: Image,
    [Tabs.name]: Tabs,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Icon.name]: Icon,
    [Rate.name]: Rate,
    [Popup.name]: Popup,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem
  },
  filters: {
    timeFilers(time) {
      return time.substr(5, 6).replace(/-/, '/')
    },
    starFilers(time) {
      return getWeek(time)
    },
    periodFilers(val) {
      var arr = ['报名中', '已满员', '已开始', '活动已结束', '未成行', '报名已截止']
      return arr[val]
    }
  },
  data() {
    return {
      id: undefined,
      storeId: undefined,
      activityData: null,
      activityPeriod: null,
      activityGuideL: 0,
      activityMember: null,
      activityGuide: [],
      activityComment: [],
      showCode: false, // 咨询窗口
      showInform: false,
      period: 0, // 选时间
      active: 0, // tab栏
      value: 3,
      isFavorites: 0 // 0未收藏1已收藏
    }
  },
  computed: {
    ...mapGetters(['userData'])
  },
  created() {
    this.storeId = this.$route.params.storeId
    var id = this.$route.params.activityId
    if (id) {
      Toast.loading()
      this.id = id
      this.initData()
      this.checkFavorites()
      this.getCommentList()
    } else {
      this.onJump('index')
    }
  },
  mounted() {},
  methods: {
    initData() {
      var that = this
      getActivityDetail({ id: this.id }).then(res => {
        if (res.data.code === 1) {
          res.data.data.comment.score = parseFloat(res.data.data.comment.score, 2)
          res.data.data.period = res.data.data.period.map(item => {
            item.period_status = pastDue(item.abort_time)// 是否过期
            return item
          })
          that.activityData = res.data.data
          this.setShare(res.data.data)
          if (res.data.data.period.length > 0) {
            that.period = res.data.data.period[0].id
            this.getPeriod(res.data.data.period[0].id)
            that.$nextTick(() => {
              const timer = setTimeout(() => {
                if (timer) {
                  clearTimeout(timer)
                  that.verScroll()
                }
              }, 100)
            })
            Toast.clear()
          } else {
            Toast.fail('活动已结束')
          }
        } else {
          Toast.fail(res.data.info)
        }
        console.log('activityData', res.data.data)
      })
    },
    // 分享
    setShare(data) {
      wxApi.init(['updateAppMessageShareData', 'updateTimelineShareData'], true).then((wx, res) => {
        wx.updateAppMessageShareData({
          title: data.name, // 分享标题
          link: 'http://www.lianpenkeji.com/activityDetails/' + this.storeId + '/' + this.id,
          imgUrl: data.banner[0], // 分享图标
          desc: data.d_name,
          success: res => {
            this.setShareCount(2)
          },
          cancel: err => {
            console(err)
          }
        })
        wx.updateTimelineShareData({
          title: data.name, // 分享标题
          link: 'http://www.lianpenkeji.com/activityDetails/' + this.storeId + '/' + this.id,
          imgUrl: data.banner[0], // 分享图标
          desc: data.d_name,
          success: res => {
            this.setShareCount(1)
          },
          cancel: err => {
            console(err)
          }
        })
      })
    },
    setShareCount(type) {
      getActivityShare({
        id: this.id,
        source_type: type
      }).then(res => {
        console.log('分享成功')
      })
    },
    getPeriod(id) {
      getActivityPeriod({ id: id }).then(res => {
        res.data.data.period_status = pastDue(res.data.data.abort_time) ? 5 : res.data.data.period_status // 是否过期
        this.activityPeriod = res.data.data
        console.log('activityPeriod', res.data.data)
        this.activityGuide = res.data.data.member.guide ? res.data.data.member.guide.slice(0, 3) : []
        this.activityGuideL = res.data.data.member.guide ? res.data.data.member.guide.length : 0
        this.activityMember = res.data.data.member.member ? res.data.data.member.member.slice(0, 9 - this.activityGuide.length) : []
      })
    },
    // 检查收藏
    checkFavorites() {
      checkFavorites({ id: this.id }).then(res => {
        this.isFavorites = res.data.data.is_favorites
        console.log(res.data.data.is_favorites)
      })
    },
    // 点击收藏
    onFavorites() {
      favorites({ id: this.id }).then(res => {
        if (res.data.code === 1) {
          if (this.isFavorites === 1) {
            this.isFavorites = 0
            this.activityData.favorites_count = this.activityData.favorites_count - 1
          } else {
            this.isFavorites = 1
            this.activityData.favorites_count = this.activityData.favorites_count + 1
          }
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    // 获取评论
    getCommentList() {
      getActivityComment({ id: this.id }).then(res => {
        this.activityComment = res.data.data.list.map(item => {
          item.guide = item.guide.join('、')
          return item
        })
        console.log('评论', res.data.data.list)
      })
    },
    tabChange(e) {
      if (e === 3) {
        this.getCommentList()
      }
    },
    verScroll() {
      const width = this.activityData.period.length * 110// 动态计算出滚动区域的大小，前面已经说过了，产生滚动的原因是滚动区域宽度大于父盒子宽度
      this.$refs.cont.style.width = width + 'px' // 修改滚动区域的宽度
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.wrapper, {
            startX: 0, // 配置的详细信息请参考better-scroll的官方文档，这里不再赘述
            click: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: 'vertical'
          })
        } else {
          this.scroll.refresh() // 如果dom结构发生改变调用该方法
        }
      })
    },
    // 报名按钮
    enroll() {
      if (this.period) {
        this.$router.push({
          name: 'activityEnroll',
          params: { storeId: this.storeId, activityId: this.id, periodId: this.period }
        })
      } else {
        Toast.fail('请选择时间')
      }
      console.log(this.period)
    },
    // 发送通知
    inform() {
      notice({ period_id: this.period }).then(res => {
        Toast.success('发送成功')
        this.showInform = false
      })
    },
    onJumpUser() {
      this.$router.push({
        name: 'activityUserList',
        params: { storeId: this.storeId, periodId: this.period }
      })
    },
    onJump(name) {
      this.$router.push({
        name: name,
        params: { storeId: this.storeId }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .banner-box{
    background: #fff;
    .cover-path{
      width: 100%;
      height: 240px
    }
  }
  .details-box{
    background: #fff;
    padding: 13px;
    color: #333;
    .activity-title{
      font-size:16px;
      font-weight:bold;
      color:rgba(51,51,51,1);
      padding-bottom: 13px;
    }
    .activity-info{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .info-l{
        display: flex;
        align-items: center;
        .money{
          font-size:18px;
          color: #FF2C36;
          font-weight: bold;
        }
        .unit{
          font-size:11px;
        }
        .vip-status{
          height:15px;
          background:rgba(76,72,69,1);
          border-radius:8px;
          font-size:10px;
          font-weight:500;
          color:rgba(235,206,160,1);
          padding: 0 6px;
          margin-left: 10px;
        }
      }
      .info-r{
        color: #FD9F5A;
        font-size: 12px;
        display: flex;
        align-items: center;
        .icon-like{
          font-size: 16px;
          margin-right: 6px;
        }
      }
    }
    .activity-introduce{
      margin-bottom: 8px;
      font-size: 11px;
      margin-top: 8px;
      .introduce-title{
        height:14px;
        background: @theme-color;
        border-radius:6px;
        font-size:11px;
        font-weight:500;
        color: #fff;
        text-align: center;
        padding: 0 5px;
        margin-right: 10px;
      }
    }
  }
  .vip-box{
    width:355px;
    padding: 5px 10px;
    background:rgba(255,237,194,1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    color: #99733A;
    .vip-l{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .icon-hint{
      font-size: 20px;
    }
  }
  .time-box{
    background: #fff;
    color: #333;
    padding:0 13px;
    margin-top: 11px;
    .time-title{
      font-size: 13px;
      padding-left: 12px;
      position: relative;
      height: 38px;
      line-height: 38px;
      border-bottom: 1px solid #eee;
      &:after{
        position: absolute;
        content: '';
        width:4px;
        height:14px;
        background: @theme-color;
        border-radius:2px;
        left: 0;
        top: 12px;
      }
    }
    .time-list{
      overflow: hidden;
      height: 90px;
      overflow-x: scroll;
      -webkit-overflow-scrolling: touch;
      display: -webkit-box;
      .list-box{
        list-style: none;
        white-space: nowrap;
        font-size: 12px;
        text-align: center;
        height: 90px;
      }
      .time-item{
        margin: 20px 0;
        display: inline-block;
        height:52px;
        margin-right: 10px;
        position: relative;
        overflow: initial;
        .time-hint{
          position: absolute;
          top: -13px;
          left: 20%;
          z-index: 3;
          color: #fff;
          background: #FD9F5A;
          font-size: 10px;
          padding: 0 5px;
          line-height: 18px;
          border-radius: 5px;
          &:before{
            content: '';
            width:0; height:0; font-size:0;border-style:solid;overflow:hidden; position:absolute;
            border-width:6px;
            border-color:#FD9F5A transparent transparent transparent;
            left:50%; top:15px;
            margin-left: -3px;
            z-index: 3;
          }
        }
        .item-box{
          position: relative;
          background:rgba(248,248,248,1);
          border:1px solid rgba(230,225,225,1);
          border-radius:6px;
          height:45px;
          font-size: 12px;
          padding: 5px 10px 0 10px;
          overflow: hidden;
          &.time-select{
            background:rgba(245,255,249,1);
            border:1px solid rgba(31,208,160,1);
            overflow: hidden;
            .checke-bg{
              position: absolute;
              right: 0;
              bottom: -24px;
              z-index: 2;
              width:0; height:0; font-size:0;border-style:solid;overflow:hidden;
              border-width:22px;border-color:transparent @theme-color transparent transparent;
              background: none;
            }
            .icon-checked{
              position: absolute;
              right: 0;
              bottom: 2px;
              font-size: 10px;
              color: #fff;
              z-index: 3;
            }
          }
          .time-val{
            .small{
              font-size: 10px;
            }
          }
          .apply-count{
            color: #FF2C36;
            font-size: 10px;
            &.residue{
              color: #FE840C;
            }
            &.finish{
              color: #FF1CDC;
            }
            &.period{
              color: #999;
            }
          }
        }
      }
    }
  }
  .van-radio-group{
    &::-webkit-scrollbar {
      background-color: transparent;
    }
  }
  .user-box{
    margin-top: 11px;
    background: #fff;
    padding: 0 13px;
    color: #333;
    .user-title{
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 12px;
      position: relative;
      height: 38px;
      line-height: 38px;
      border-bottom: 1px solid #eee;
      &:after{
        position: absolute;
        content: '';
        width:4px;
        height:14px;
        background: @theme-color;
        border-radius:2px;
        left: 0;
        top: 12px;
      }
      .count{
        display: flex;
        align-items: center;
      }
    }
    .user-list{
      display: flex;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 10px 0;
      .user-item{
        position: relative;
        text-align: center;
        margin-right: 4px;
        width: 35px;
        &:last-child{
          margin-right: 0;
        }
        .icon-lead{
          position: absolute;
          z-index: 9;
          right: 0;
          bottom: 15px;
          font-size: 18px;
        }
        .team-count{
          position: absolute;
          z-index: 9;
          right: 0;
          bottom: 15px;
          font-size: 9px;
          color: #fff;
          background: @theme-color;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          text-align: center;
          line-height: 14px;
        }
        .user-name{
          font-size:10px;
          color:rgba(102,102,102,1);
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
        }
        .avatar-img{
          width:30px;
          height:30px;
          border-radius:50%;
        }
      }
    }
  }
  .content-box{
    margin-top: 11px;
    margin-bottom: 50px;
    .tab-box{
      background: #fff;
      padding: 13px;
      color: #333;
    }
  }
  .score-box{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .score-all{
      width:100px;
      height:125px;
      border:1px solid rgba(222,222,222,1);
      border-radius:6px;
      text-align: center;
      color: #959595;
      .all-title{
        height: 33px;
        line-height: 33px;
        border-bottom:1px solid rgba(222,222,222,1);
        color: #333;
        font-size: 12px;
      }
      .all-val{
        font-size:24px;
        font-weight:bold;
        padding: 7px 0;
      }
      .all-count{
        padding-top: 4px;
        font-size:11px;
      }
    }
    .score-list{
      margin-left: 25px;
      .score-item{
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        color: #959595;
        font-size: 12px;
        &:last-child{
          margin-bottom: 0;
        }
      }
      .score-item-title{
        width: 30px;
      }
      .score-item-progress{
        width:130px;
        height:5px;
        background: rgba(236, 236, 236, 0.51);
        border-radius:3px;
        position: relative;
        overflow: hidden;
        margin: 0 15px;
        .progress{
          position: absolute;
          left: 0;
          top: 0;
          height:5px;
          z-index: 2;
          background: #FF7D01;
        }
      }
    }
  }
  .comment-title{
    color: @theme-color;
    border-bottom: 1px solid #eee;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    margin-top: 10px;
  }
  .comment-box{
    .comment-more{
      text-align: center;
      margin-top: 12px;
      font-size: 12px;
      color: #999999;
    }
    .comment-item{
      display: flex;
      border-bottom: 1px solid #eee;
      padding-top: 20px;
      padding-bottom: 10px;
      .user-info{
        margin-right: 10px;
        text-align: center;
        width: 70px;
      }
      .avatar-img{
        height: 42px;
        width: 42px;
      }
      .user-name{
        color: #999999;
        font-size: 11px;
        margin-top: 5px;
      }
      .comment-info{
        width: 290px;
        color: #666666;
        font-size: 13px;
      }
      .comment-content{
        line-height: 21px;
        width: 100%;
        word-break:break-all;
      }
      .comment-rate-star{
        margin: 10px 0;
      }
      .order-info{
        color: #999999;
        font-size: 11px;
      }
    }
  }
  .comment-box-null{
    padding-top: 30px;
    padding-bottom: 20px;
    text-align: center;
    font-size: 12px;
    color: #999999;
  }
  .footer-box{
    position: fixed;
    width:92%;
    padding: 0 4%;
    height:46px;
    background:rgba(255,255,255,1);
    box-shadow:0 -1px 3px 0 rgba(0, 0, 0, 0.06);
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: space-between;
    bottom: 0;
    left: 0;
    .footer-item{
      width: 14%;
      text-align: center;
      color: #999;
      position: relative;
      &:first-child{
        &:after{
          width: 0;
        }
      }
      &:after{
        z-index: 3;
        content: '';
        position: absolute;
        width: 1px;
        height: 25px;
        background: #DEDEDE;
        left: -5px;
        top: 10px;
      }
      .footer-item-text{
        display: block;
        font-size: 12px;
        margin-top: 2px;
      }
      .icon-footer{
        font-size: 24px;
      }
    }
    .apply-btn{
      width: 50%;
      height:38px;
      background:rgba(19,209,181,1);
      border-radius:19px;
      text-align: center;
      line-height: 38px;
      font-size: 18px;
      color: #fff;
      &.gary-btn{
        background: #c4c4c4;
      }
      &.small-btn{
        font-size: 14px;
      }
    }
  }
  .van-popup{
    border-radius: 10px;
  }
  .popup-box{
    position: relative;
    width: 290px;
    padding: 40px 0;
    border-radius: 4px;
    .code-path{
      height: 100px;
      width: 100px;
      margin: 0 auto;
    }
    .code-hint{
      text-align: center;
      font-size: 12px;
      margin-top: 10px;
    }
    .icon-close{
      position: absolute;
      color: @theme-color;
      font-size: 24px;
      right: 10px;
      top: 10px;
    }
  }
  .inform-box{
    position: relative;
    width: 290px;
    padding: 20px 0;
    border-radius: 4px;
    .inform-title{
      text-align: center;
      font-size: 14px;
      color: #333;
      padding-bottom: 20px;
    }
    p{
      font-size: 12px;
      color: #999;
      padding: 0 20px;
      line-height: 22px;
    }
    .reb{
      color: red;
    }
    .inform-btns{
      width: 240px;
      margin: 20px auto 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .inform-close{
        width: 100px;
        text-align: center;
        height: 30px;
        line-height: 30px;
        border-radius: 20px;
        font-size: 14px;
        color: @theme-color;
        border: 1px solid @theme-color;
      }
      .inform-allow{
        width: 100px;
        text-align: center;
        height: 30px;
        line-height: 30px;
        border-radius: 20px;
        font-size: 14px;
        background: @theme-color;
        color: #fff;
        border: 1px solid @theme-color;
      }
    }
  }
</style>
