import { Link } from 'react-router-dom'
import { ChevronLeftIcon } from 'lucide-react'

import Logo from '@/components/logo'

const PrivacyPolicy = () => {
  return (
    <div className='mx-auto max-w-3xl px-4 py-12'>
      <Link to='/register' className='text-muted-foreground group mb-8 flex items-center gap-2'>
        <ChevronLeftIcon className='size-4 transition-transform duration-200 group-hover:-translate-x-0.5' />
        <p>返回注册</p>
      </Link>

      <div className='mb-8'>
        <Logo className='mb-6 gap-3' />
        <h1 className='mb-2 text-3xl font-bold'>隐私政策</h1>
        <p className='text-muted-foreground text-sm'>最后更新时间：2024 年 12 月</p>
      </div>

      <div className='prose prose-neutral dark:prose-invert max-w-none space-y-6'>
        <section>
          <h2 className='text-xl font-semibold'>1. 引言</h2>
          <p className='text-muted-foreground leading-relaxed'>
            奕成平台（以下简称"我们"）非常重视用户的隐私保护。本隐私政策旨在向您说明我们如何收集、使用、
            存储和保护您的个人信息。请您在使用我们的服务前，仔细阅读并理解本政策。
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>2. 信息收集</h2>
          <div className='text-muted-foreground space-y-3 leading-relaxed'>
            <p>我们可能收集以下类型的信息：</p>
            <ul className='list-inside list-disc space-y-2 pl-4'>
              <li><strong>账户信息：</strong>注册时提供的邮箱地址、用户名、密码等</li>
              <li><strong>个人资料：</strong>头像、昵称、联系方式等您选择提供的信息</li>
              <li><strong>使用数据：</strong>您使用服务时产生的日志、操作记录等</li>
              <li><strong>设备信息：</strong>设备类型、操作系统、浏览器类型、IP 地址等</li>
              <li><strong>Cookie 数据：</strong>用于改善用户体验的 Cookie 和类似技术</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>3. 信息使用</h2>
          <div className='text-muted-foreground space-y-3 leading-relaxed'>
            <p>我们收集的信息将用于以下目的：</p>
            <ul className='list-inside list-disc space-y-2 pl-4'>
              <li>提供、维护和改进我们的服务</li>
              <li>处理您的请求和交易</li>
              <li>发送服务相关的通知和更新</li>
              <li>进行数据分析以改善用户体验</li>
              <li>检测和防止欺诈或安全问题</li>
              <li>遵守法律法规的要求</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>4. 信息共享</h2>
          <div className='text-muted-foreground space-y-3 leading-relaxed'>
            <p>我们不会出售您的个人信息。在以下情况下，我们可能会共享您的信息：</p>
            <ul className='list-inside list-disc space-y-2 pl-4'>
              <li><strong>经您同意：</strong>在获得您明确同意的情况下</li>
              <li><strong>服务提供商：</strong>与帮助我们运营服务的第三方合作伙伴</li>
              <li><strong>法律要求：</strong>为遵守法律法规或响应法律程序</li>
              <li><strong>业务转让：</strong>在合并、收购或资产出售的情况下</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>5. 数据安全</h2>
          <p className='text-muted-foreground leading-relaxed'>
            我们采取合理的技术和组织措施来保护您的个人信息，防止未经授权的访问、使用或披露。
            这些措施包括数据加密、访问控制、安全审计等。但请注意，没有任何互联网传输或电子存储方法是完全安全的。
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>6. 数据保留</h2>
          <p className='text-muted-foreground leading-relaxed'>
            我们将在实现本政策所述目的所需的期间内保留您的个人信息，除非法律要求或允许更长的保留期限。
            当不再需要您的信息时，我们将安全地删除或匿名化处理。
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>7. 您的权利</h2>
          <div className='text-muted-foreground space-y-3 leading-relaxed'>
            <p>根据适用的法律法规，您可能享有以下权利：</p>
            <ul className='list-inside list-disc space-y-2 pl-4'>
              <li><strong>访问权：</strong>请求访问我们持有的您的个人信息</li>
              <li><strong>更正权：</strong>请求更正不准确或不完整的信息</li>
              <li><strong>删除权：</strong>请求删除您的个人信息</li>
              <li><strong>限制处理权：</strong>请求限制我们处理您的信息</li>
              <li><strong>数据可携带权：</strong>请求获取您信息的副本</li>
              <li><strong>撤回同意权：</strong>撤回您之前给予的同意</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>8. Cookie 使用</h2>
          <p className='text-muted-foreground leading-relaxed'>
            我们使用 Cookie 和类似技术来收集信息并改善您的体验。您可以通过浏览器设置管理 Cookie 偏好。
            但请注意，禁用某些 Cookie 可能会影响网站的功能。
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>9. 未成年人保护</h2>
          <p className='text-muted-foreground leading-relaxed'>
            我们的服务不面向 18 岁以下的未成年人。我们不会故意收集未成年人的个人信息。
            如果我们发现已收集未成年人的信息，将立即采取措施删除。
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>10. 政策更新</h2>
          <p className='text-muted-foreground leading-relaxed'>
            我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，并注明更新日期。
            我们建议您定期查看本政策以了解任何变更。
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>11. 联系我们</h2>
          <p className='text-muted-foreground leading-relaxed'>
            如果您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
          </p>
          <div className='text-muted-foreground mt-2 space-y-1'>
            <p>邮箱：privacy@yicheng.com</p>
            <p>地址：中国北京市</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicy
