import { Link } from 'react-router-dom'
import { ChevronLeftIcon } from 'lucide-react'

import Logo from '@/components/logo'

const TermsOfService = () => {
  return (
    <div className='mx-auto max-w-3xl px-4 py-12'>
      <Link to='/register' className='text-muted-foreground group mb-8 flex items-center gap-2'>
        <ChevronLeftIcon className='size-4 transition-transform duration-200 group-hover:-translate-x-0.5' />
        <p>返回注册</p>
      </Link>

      <div className='mb-8'>
        <Logo className='mb-6 gap-3' />
        <h1 className='mb-2 text-3xl font-bold'>服务条款</h1>
        <p className='text-muted-foreground text-sm'>最后更新时间：2024 年 12 月</p>
      </div>

      <div className='prose prose-neutral dark:prose-invert max-w-none space-y-6'>
        <section>
          <h2 className='text-xl font-semibold'>1. 服务协议的接受</h2>
          <p className='text-muted-foreground leading-relaxed'>
            欢迎使用奕成平台（以下简称"本平台"）。在使用本平台提供的任何服务之前，请您仔细阅读本服务条款。
            当您访问或使用本平台时，即表示您同意受本服务条款的约束。如果您不同意本条款的任何部分，请勿使用本平台。
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>2. 服务说明</h2>
          <p className='text-muted-foreground leading-relaxed'>
            本平台为用户提供后台管理服务，包括但不限于用户管理、数据分析、内容管理等功能。
            我们保留随时修改、暂停或终止服务的权利，恕不另行通知。
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>3. 用户账户</h2>
          <div className='text-muted-foreground space-y-3 leading-relaxed'>
            <p>3.1 您必须提供准确、完整的注册信息，并及时更新以保持其准确性。</p>
            <p>3.2 您有责任维护账户的安全性，包括保护您的密码不被泄露。</p>
            <p>3.3 您对通过您的账户进行的所有活动负责。</p>
            <p>3.4 如果发现任何未经授权使用您账户的情况，请立即通知我们。</p>
          </div>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>4. 用户行为规范</h2>
          <div className='text-muted-foreground space-y-3 leading-relaxed'>
            <p>您同意不会：</p>
            <ul className='list-inside list-disc space-y-2 pl-4'>
              <li>违反任何适用的法律法规</li>
              <li>侵犯他人的知识产权或其他权利</li>
              <li>上传或传播恶意软件、病毒或其他有害代码</li>
              <li>干扰或破坏本平台的正常运行</li>
              <li>未经授权访问本平台的系统或数据</li>
              <li>进行任何可能损害本平台或其用户的行为</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>5. 知识产权</h2>
          <p className='text-muted-foreground leading-relaxed'>
            本平台的所有内容，包括但不限于文本、图形、标志、图标、图像、音频剪辑、数字下载和软件，
            均为本平台或其内容提供商的财产，受中国和国际版权法保护。
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>6. 免责声明</h2>
          <div className='text-muted-foreground space-y-3 leading-relaxed'>
            <p>6.1 本平台按"现状"和"可用"基础提供服务，不提供任何明示或暗示的保证。</p>
            <p>6.2 我们不保证服务将不间断、及时、安全或无错误。</p>
            <p>6.3 对于因使用或无法使用本平台而导致的任何损失，我们不承担责任。</p>
          </div>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>7. 条款修改</h2>
          <p className='text-muted-foreground leading-relaxed'>
            我们保留随时修改本服务条款的权利。修改后的条款将在本页面发布后立即生效。
            您继续使用本平台即表示您接受修改后的条款。
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold'>8. 联系我们</h2>
          <p className='text-muted-foreground leading-relaxed'>
            如果您对本服务条款有任何疑问，请通过以下方式联系我们：
          </p>
          <p className='text-muted-foreground mt-2'>
            邮箱：support@yicheng.com
          </p>
        </section>
      </div>
    </div>
  )
}

export default TermsOfService
