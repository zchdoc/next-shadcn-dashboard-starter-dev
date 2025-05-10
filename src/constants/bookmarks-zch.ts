export interface BookmarkLink {
  title: string;
  url: string;
}
export interface BookmarkGroup {
  title: string;
  links: BookmarkLink[];
}
export interface BookmarkData {
  [key: string]: BookmarkGroup;
}
export const bookmarkDataZch: BookmarkData = {
  xbClientLogin: {
    title: 'XB Client Login',
    links: [
      { title: 'J1c', url: 'http://1.singbon.com:81' },
      { title: 'A2c', url: 'http://a2.4000063966.com:81' },
      { title: 'A3c', url: 'http://a3c.4000063966.com:8081' },
      { title: 'A4c', url: 'http://a4c.4000063966.com:8081' },
      { title: 'Cdzc', url: 'http://cdz.4000063966.com:8081' },
      { title: 'Gxcdzc', url: 'http://chongdian.4000063966.com:81' }
    ]
  },
  xbLogin: {
    title: 'XB Login',
    links: [
      { title: 'J1cb', url: 'http://1.singbon.com:81/xb/login.do' },
      { title: 'A2cb', url: 'http://a2.4000063966.com:81/xb/login.do' },
      { title: 'A3cb', url: 'http://a3c.4000063966.com:8081/xb/login.do' },
      { title: 'A4cb', url: 'http://a4c.4000063966.com:8081/xb/login.do' },
      { title: 'Cdzcb', url: 'http://cdz.4000063966.com:8084/login' },
      {
        title: 'Gxcdzcb',
        url: 'http://chongdian.4000063966.com:81/singbon/backgroud/system/admin/login.do'
      }
    ]
  },
  xbInfoQuery: {
    title: 'XB Info Query',
    links: [
      {
        title: 'J1Query',
        url: 'http://1.singbon.com:81/netInterface/singbon/companyIndex.do'
      },
      {
        title: 'A2Query',
        url: 'http://a2.4000063966.com:81/netInterface/singbon/companyIndex.do'
      },
      {
        title: 'A3Query',
        url: 'http://a3c.4000063966.com:8081/netInterface/singbon/companyIndex.do'
      },
      {
        title: 'A4Query',
        url: 'http://a4c.4000063966.com:8081/netInterface/singbon/companyIndex.do'
      },
      {
        title: 'CdzQuery',
        url: 'http://cdz.4000063966.com:8081/netInterface/singbon/companyIndex.do'
      },
      {
        title: 'JustQuery',
        url: 'https://navgit.wwzh.xyz/pages/xb-tools/xb-encrypt-js.html'
      }
    ]
  },
  socialMedia: {
    title: 'Social Media',
    links: [
      { title: 'X', url: 'https://x.com/' },
      { title: 'Bsky', url: 'https://bsky.app' },
      { title: 'Reddit', url: 'https://www.reddit.com' },
      { title: 'Telegram', url: 'https://web.telegram.org/a/' },
      { title: 'Discord', url: 'https://discord.com/channels/@me' },
      { title: 'Ins', url: 'https://www.instagram.com/' },
      { title: 'LinuxDo', url: 'https://linux.do/' },
      { title: 'Zhihu', url: 'https://www.zhihu.com' },
      { title: '52Pj', url: 'https://www.52pojie.cn/' }
    ]
  },
  aiEn: {
    title: 'AI EN',
    links: [
      { title: 'Grok', url: 'https://x.com/i/grok' },
      { title: 'GrokApi', url: 'https://console.x.ai/' },
      { title: 'OpenAI', url: 'https://chat.openai.com/' },
      { title: 'Claude', url: 'https://claude.ai/new' },
      { title: 'Groq', url: 'https://groq.com/' },
      { title: 'Mistral', url: 'https://chat.mistral.ai/chat' },
      { title: 'Gemini', url: 'https://gemini.google.com/app' },
      {
        title: 'AiStudio',
        url: 'https://aistudio.google.com/app/prompts/new_chat'
      },
      { title: 'Perplexity', url: 'https://www.perplexity.ai/' },
      {
        title: 'Fireworks',
        url: 'https://fireworks.ai/models/fireworks/f1-preview/playground'
      },
      {
        title: 'CoZeEn',
        url: 'https://www.coze.com/space/7322025004764364806/bot'
      },
      { title: 'CiCi', url: 'https://www.ciciai.com/' }
    ]
  },
  aiCn: {
    title: 'AI CN',
    links: [
      { title: 'DeepSeek', url: 'https://chat.deepseek.com' },
      { title: 'DeepSeekApi', url: 'https://platform.deepseek.com' },
      { title: 'TongYi', url: 'https://tongyi.aliyun.com/' },
      { title: 'MoonShot', url: 'https://kimi.moonshot.cn/' },
      { title: 'ChatGlm', url: 'https://chatglm.cn/detail' },
      { title: 'YiYan', url: 'https://yiyan.baidu.com/' },
      { title: 'YuanBao', url: 'https://yuanbao.tencent.com/' },
      { title: 'LingYi', url: 'https://platform.lingyiwanwu.com/' },
      { title: '360Chat', url: 'https://chat.360.cn/chat' },
      { title: 'XingHuo', url: 'https://xinghuo.xfyun.cn/' },
      { title: 'Qwen', url: 'https://chat.qwen.ai/' },
      {
        title: 'CoZeCn',
        url: 'https://www.coze.cn/space/7346541960162869283/bot'
      },
      { title: 'DouBao', url: 'https://www.doubao.com/chat/' }
    ]
  },
  tools: {
    title: 'Tools',
    links: [
      {
        title: 'Pulse-Water-Billing-Calc',
        url: 'https://navgit.wwzh.xyz/pages/pulse-water-billing-calc/pulse-water-billing-calc.html'
      },
      {
        title: 'Localize',
        url: 'https://navgit.wwzh.xyz/pages/chrome-bookmarks-simple/index.html?name=bscus'
      },
      {
        title: 'Ip-Check',
        url: 'https://navgit.wwzh.xyz/pages/ip-check-query/ip-check-query.html'
      },
      {
        title: 'Qr-Generate',
        url: 'https://navgit.wwzh.xyz/pages/qr-styling/index.html'
      },
      {
        title: 'Dup-Remove',
        url: 'https://navgit.wwzh.xyz/pages/duplicate-str-remove/duplicate-remove.html'
      },
      {
        title: 'Random-Num',
        url: 'https://navgit.wwzh.xyz/pages/random/random-gen.html'
      },
      {
        title: 'Hex-Dec-Convert',
        url: 'https://navgit.wwzh.xyz/pages/num-bin-convert/index.html'
      },
      {
        title: 'Rmb-Chinese-Convert',
        url: 'https://navgit.wwzh.xyz/pages/rmb_convert/RMB_2_Chinese_Up.html'
      }
    ]
  },
  mineSite: {
    title: 'Mine Site',
    links: [
      { title: 'Att', url: 'https://att.wwzh.xyz/' },
      // https://zchdoc.github.io/html-chrome-bookmark-render/
      {
        title: 'Html-Chrome-Bookmark-Render',
        url: 'https://zchdoc.github.io/html-chrome-bookmark-render/'
      },
      // https://navgit.wwzh.xyz/pages/my-bookmarks-simple/index.html?key=mine
      {
        title: 'My-Bookmarks-Simple',
        url: 'https://navgit.wwzh.xyz/pages/my-bookmarks-simple/index.html?key=mine'
      },
      // https://tool.wwzh.xyz/dashboard/bookmark/chrome-bookmark
      {
        title: 'Z.ToolV1',
        url: 'https://tool.wwzh.xyz/dashboard/bookmark/chrome-bookmark'
      },
      {
        title: 'Pin-Tree-Dev',
        url: 'https://ptd.wwzh.xyz/'
      },
      {
        title: 'Pin-Tree-Dev-Old',
        url: 'https://pintree-dev-z-git-dev24-0720-customjson-zchdocs-projects.vercel.app/'
      }
    ]
  },
  searchEngines: {
    title: 'Search Engines',
    links: [
      { title: 'Google', url: 'https://www.google.com' },
      { title: 'DuckDuckGo', url: 'https://www.duckduckgo.com' },
      { title: 'Bing', url: 'https://www.bing.com' },
      { title: 'Baidu', url: 'https://www.baidu.com' },
      { title: 'Sogou', url: 'https://www.sogou.com' },
      { title: 'So360', url: 'https://www.so.com/' }
    ]
  },
  git: {
    title: 'Git',
    links: [
      { title: 'Github', url: 'https://github.com/zchdoc' },
      { title: 'Gitee', url: 'https://gitee.com/' },
      { title: 'Codeup', url: 'https://codeup.aliyun.com/' },
      { title: 'Gitlab', url: 'https://gitlab.com/' },
      { title: 'Csdn-git', url: 'https://gitcode.com/' },
      { title: 'Github-m', url: 'https://github.com/trending?since=monthly' }
    ]
  },
  aiWithShell: {
    title: 'AI Shelled',
    links: [
      { title: 'Copilot', url: 'https://github.com/features/copilot' },
      { title: 'JuChat', url: 'https://www.juchats.com/chat' },
      { title: 'OAiFree', url: 'https://shared.oaifree.com/' }
    ]
  },
  aiRanking: {
    title: 'AI Ranking',
    links: [
      { title: 'R-SuperClue', url: 'https://www.superclueai.com' },
      { title: 'R-LMsys', url: 'https://chat.lmsys.org/?leaderboard' },
      { title: 'R-Aider', url: 'https://aider.chat/docs/leaderboards' },
      {
        title: 'R-OpenRouter',
        url: 'https://openrouter.ai/rankings/programming?view=month'
      }
    ]
  },
  aiApiMerchant: {
    title: 'AI API Merchant',
    links: [
      { title: 'OpenRChat', url: 'https://openrouter.ai/chat' },
      { title: 'HuggingFace', url: 'https://huggingface.co/' },
      { title: 'HuggingChat', url: 'https://huggingface.co/chat/' },
      { title: 'SiliconFlow', url: 'https://cloud.siliconflow.cn/' }
    ]
  },
  aiLocal: {
    title: 'AI Local',
    links: [
      { title: 'OLlaMa', url: 'https://ollama.ai/' },
      { title: 'LMStudio', url: 'https://lmstudio.ai/' }
    ]
  },
  translation: {
    title: 'Translation',
    links: [
      { title: 'Google', url: 'https://translate.google.com/' },
      {
        title: 'GoogleHK',
        url: 'https://translate.google.com.hk/?hl=zh-CN&sl=auto&tl=en&op=translate'
      },
      { title: 'Bing', url: 'https://cn.bing.com/translator' },
      { title: 'Baidu', url: 'https://fanyi.baidu.com/' },
      { title: 'Youdao', url: 'https://fanyi.youdao.com/#/TextTranslate' },
      {
        title: 'Immersive',
        url: 'https://app.immersivetranslate.com/text'
      },
      {
        title: 'Tencent',
        url: 'https://fanyi.qq.com/'
      },
      {
        title: 'Oxford',
        url: 'https://www.oed.com/'
      },
      {
        title: 'Cambridge',
        url: 'https://dictionary.cambridge.org/zhs/'
      },
      { title: 'DeepL', url: 'https://www.deepl.com/zh/translator' }
    ]
  }
};
