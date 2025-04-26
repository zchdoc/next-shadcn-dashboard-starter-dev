'use client';
import { useState, useEffect } from 'react';
import { BookmarkContent } from '@/components/bookmark/bookmark-content';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
interface BookmarkData {
  [key: string]: {
    title: string;
    links: { title: string; url: string }[];
  };
}
export default function BookmarkPage() {
  const bookmarkData: BookmarkData = {
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
        // a3c.4000063966.com:8081/netInterface/singbon/companyIndex.do
        {
          title: 'A3Query',
          url: 'http://a3c.4000063966.com:8081/netInterface/singbon/companyIndex.do'
        },
        // a4c.4000063966.com:8081/netInterface/singbon/companyIndex.do
        {
          title: 'A4Query',
          url: 'http://a4c.4000063966.com:8081/netInterface/singbon/companyIndex.do'
        },
        // cdz.4000063966.com:8081/netInterface/singbon/companyIndex.do
        {
          title: 'CdzQuery',
          url: 'http://cdz.4000063966.com:8081/netInterface/singbon/companyIndex.do'
        },
        // https://navgit.wwzh.xyz/pages/xb-tools/xb-encrypt-js.html
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
        { title: 'Teddit', url: 'https://www.reddit.com' },
        { title: 'Telegram', url: 'https://web.telegram.org/a/' },
        { title: 'Discord', url: 'https://discord.com/channels/@me' },
        { title: 'Ins', url: 'https://www.instagram.com/' },
        { title: 'LinuxDo', url: 'https://linux.do/' },
        { title: 'Zhihu', url: 'https://www.zhihu.com' },
        { title: '52Pj', url: 'https://www.52pojie.cn/' }
      ]
    },
    tools: {
      title: 'Tools',
      links: [
        {
          title: 'Pulse-Water-Billing-Calc',
          // url: '../pulse-water-billing-calc/pulse-water-billing-calc.html',
          url: 'https://navgit.wwzh.xyz/pages/pulse-water-billing-calc/pulse-water-billing-calc.html'
        },
        {
          title: 'Localize',
          url: 'https://navgit.wwzh.xyz/pages/chrome-bookmarks-simple/index.html?name=bscus'
        },
        {
          title: 'Ip-Check',
          // url: '../ip-check-query/ip-check-query.html',
          url: 'https://navgit.wwzh.xyz/pages/ip-check-query/ip-check-query.html'
        },
        {
          title: 'Qr-Generate',
          // url: '../qr-styling/index.html',
          url: 'https://navgit.wwzh.xyz/pages/qr-styling/index.html'
        },
        {
          title: 'Dup-Remove',
          // url: '../duplicate-str-remove/duplicate-remove.html',
          url: 'https://navgit.wwzh.xyz/pages/duplicate-str-remove/duplicate-remove.html'
        },
        {
          title: 'Random-Num',
          // url: '../random/random-gen.html',
          url: 'https://navgit.wwzh.xyz/pages/random/random-gen.html'
        },
        {
          title: 'Hex-Dec-Convert',
          // url: '../num-bin-convert/index.html',
          url: 'https://navgit.wwzh.xyz/pages/num-bin-convert/index.html'
        },
        {
          title: 'Rmb-Chinese-Convert',
          // url: '../rmb_convert/RMB_2_Chinese_Up.html',
          url: 'https://navgit.wwzh.xyz/pages/rmb_convert/RMB_2_Chinese_Up.html'
        }
      ]
    },
    mineSite: {
      title: 'Mine Site',
      links: [
        { title: 'NextNav', url: 'https://nextnav.wwzh.xyz/' },
        { title: 'Att', url: 'https://att.wwzh.xyz/' },
        {
          title: 'Pin-Tree-Dev',
          url: 'https://ptd.wwzh.xyz/'
        },
        // https://ptd.wwzh.xyz/
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
    aiEn: {
      title: 'AI EN',
      links: [
        // https://x.com/i/grok
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
        }
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
        // https://yiyan.baidu.com/
        { title: 'YiYan', url: 'https://yiyan.baidu.com/' },
        // https://yuanbao.tencent.com/
        { title: 'YuanBao', url: 'https://yuanbao.tencent.com/' },
        // https://platform.lingyiwanwu.com/playground
        { title: 'LingYi', url: 'https://platform.lingyiwanwu.com/' },
        // https://chat.360.cn/chat
        { title: '360Chat', url: 'https://chat.360.cn/chat' },
        // https://xinghuo.xfyun.cn/
        { title: 'XingHuo', url: 'https://xinghuo.xfyun.cn/' }
      ]
    },
    aiWithShell: {
      title: 'AI Shelled',
      links: [
        // https://github.com/copilot
        { title: 'Copilot', url: 'https://github.com/features/copilot' },
        // https://www.juchats.com/chat
        { title: 'JuChat', url: 'https://www.juchats.com/chat' },
        // https://shared.oaifree.com/dashboard
        { title: 'OAiFree', url: 'https://shared.oaifree.com/' },
        {
          title: 'CoZeEn',
          url: 'https://www.coze.com/space/7322025004764364806/bot'
        },
        { title: 'CiCi', url: 'https://www.ciciai.com/' },
        {
          title: 'CoZeCn',
          url: 'https://www.coze.cn/space/7346541960162869283/bot'
        },
        { title: 'DouBao', url: 'https://www.doubao.com/chat/' }
      ]
    },
    aiApiMerchant: {
      title: 'AI API Merchant',
      links: [
        { title: 'OpenRChat', url: 'https://openrouter.ai/chat' },
        { title: 'HuggingFace', url: 'https://huggingface.co/' },
        { title: 'HuggingChat', url: 'https://huggingface.co/chat/' },
        // https://cloud.siliconflow.cn/playground/chat
        { title: 'SiliconFlow', url: 'https://cloud.siliconflow.cn/' }
      ]
    },
    aiLocal: {
      title: 'AI Local',
      links: [
        { title: 'OLlaMa', url: 'https://ollama.ai/' },
        // https://lmstudio.ai/models
        { title: 'LMStudio', url: 'https://lmstudio.ai/' }
      ]
    },
    translation: {
      title: 'Translation',
      links: [
        // https://translate.google.com/
        { title: 'Google', url: 'https://translate.google.com/' },
        // https://translate.google.com.hk/?hl=zh-CN&sl=auto&tl=en&op=translate
        {
          title: 'GoogleHK',
          url: 'https://translate.google.com.hk/?hl=zh-CN&sl=auto&tl=en&op=translate'
        },
        // https://cn.bing.com/translator
        { title: 'Bing', url: 'https://cn.bing.com/translator' },
        // https://fanyi.baidu.com/
        { title: 'Baidu', url: 'https://fanyi.baidu.com/' },
        // https://fanyi.youdao.com/#/TextTranslate
        { title: 'Youdao', url: 'https://fanyi.youdao.com/#/TextTranslate' },
        // https://app.immersivetranslate.com/text
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
        // https://www.deepl.com/zh/translator
        { title: 'DeepL', url: 'https://www.deepl.com/zh/translator' }
      ]
    }
  };
  const [selectedGroups, setSelectedGroups] = useState<string[]>([
    Object.keys(bookmarkData)[0]
  ]);
  const [isClient, setIsClient] = useState(false);
  // 在客户端加载时从 localStorage 读取保存的选择
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('bookmarkSelectedGroups');
    if (saved) {
      setSelectedGroups(JSON.parse(saved));
    }
  }, []);
  // 保存选择到本地存储
  const saveSelection = () => {
    localStorage.setItem(
      'bookmarkSelectedGroups',
      JSON.stringify(selectedGroups)
    );
  };
  // 合并所有选中分组的链接
  const allSelectedBookmarks = selectedGroups.flatMap((groupKey) =>
    bookmarkData[groupKey].links.map((link) => ({
      ...link,
      group: bookmarkData[groupKey].title
    }))
  );
  return (
    <ScrollArea className='h-[calc(100dvh-52px)]'>
      <div className='flex flex-1 p-4 md:px-6'>
        <div className='flex w-full flex-col'>
          {/* 顶部区域 */}
          <div className='flex-none py-4'>
            <div className='flex items-center gap-4'>
              {/* 选择分组 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline'>选择分组</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                  <div className='grid gap-2 p-2'>
                    {Object.entries(bookmarkData).map(([key, group]) => (
                      <div key={key} className='flex items-center space-x-2'>
                        <Checkbox
                          id={key}
                          checked={selectedGroups.includes(key)}
                          onCheckedChange={(checked) => {
                            setSelectedGroups((prev) =>
                              checked
                                ? [...prev, key]
                                : prev.filter((g) => g !== key)
                            );
                          }}
                        />
                        <label
                          htmlFor={key}
                          className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                          {group.title}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className='grid gap-2 border-t p-2'>
                    <div className='flex gap-2'>
                      <Button
                        className='flex-1'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setSelectedGroups(Object.keys(bookmarkData));
                        }}
                      >
                        全选
                      </Button>
                      <Button
                        className='flex-1'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setSelectedGroups([]);
                        }}
                      >
                        清空
                      </Button>
                      <Button
                        className='flex-1'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setSelectedGroups((prev) => {
                            const allKeys = Object.keys(bookmarkData);
                            return allKeys.filter((key) => !prev.includes(key));
                          });
                        }}
                      >
                        反选
                      </Button>
                    </div>
                    <Button
                      className='w-full'
                      variant='outline'
                      onClick={saveSelection}
                    >
                      保存选择
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className='flex flex-1 items-center gap-4'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline'>已选分组</Button>
                  </DialogTrigger>
                  <DialogContent className='max-h-[80vh] max-w-3xl overflow-y-auto'>
                    <DialogHeader>
                      <DialogTitle>已选择的分组</DialogTitle>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      {selectedGroups.map((groupKey) => (
                        <div key={groupKey} className='space-y-2'>
                          <h3 className='font-semibold'>
                            {bookmarkData[groupKey].title}
                          </h3>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                {/* 查看已选择分组内容 */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline'>已选内容</Button>
                  </DialogTrigger>
                  <DialogContent className='max-h-[80vh] max-w-3xl overflow-y-auto'>
                    <DialogHeader>
                      <DialogTitle>已选择的书签列表内容</DialogTitle>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      {selectedGroups.map((groupKey) => (
                        <div key={groupKey} className='space-y-2'>
                          <h3 className='font-semibold'>
                            {bookmarkData[groupKey].title}
                          </h3>
                          {bookmarkData[groupKey].links.map((link, index) => (
                            <div
                              key={index}
                              className='ml-4 flex items-center gap-4'
                            >
                              <div className='font-medium'>{link.title}</div>
                              <div className='text-muted-foreground text-sm'>
                                {link.url}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                {/* {isClient && (
              <p className="text-sm text-muted-foreground">
                已选择:{' '}
                {selectedGroups
                  .map((key) => bookmarkData[key].title)
                  .join(', ')}
              </p>
            )} */}
              </div>
            </div>
          </div>
          {/* 主要内容区域 */}
          <div className='flex-1 pb-6'>
            {isClient ? (
              <BookmarkContent
                bookmarks={allSelectedBookmarks}
                groupTitle=''
                cardsPerRow={6}
                showGroup={true}
                settingsKey={'zch-bookmark'}
              />
            ) : null}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
