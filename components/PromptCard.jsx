'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import moment from 'moment';

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {

  const { data: session } = useSession()
  const pathName = usePathname()
  const router = useRouter()

  const [copied, setCopied] = useState('')

  const handleCopy = () => {
    setCopied(post.prompt)
    navigator.clipboard.writeText(post.prompt)
    setTimeout(() => setCopied(""), 3000)
  }

  const navigateToProfile = () => {
    if (post.creator._id === session?.user.id) return router.push("/profile");

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  }

    // Custom function to format date to concise relative time (e.g., '28m')
    const formatRelativeTime = date => {
      const duration = moment.duration(moment().diff(moment(date)));
      if (duration.asHours() < 1) return duration.minutes() + 'm';
      if (duration.asHours() < 24) return Math.round(duration.asHours()) + 'h';
      return moment(date).fromNow();
    };

    // Format the created date
    const formattedDate = formatRelativeTime(post.createdAt);

    // Check if the post was edited
    const isEdited = post.updatedAt && post.createdAt !== post.updatedAt;


  return (
    <div className='prompt_card'>
      <div className='flex justify-between items-start gep-5'>
        <div onClick={navigateToProfile} className='flex-1 flex justify-start items-center gap-3 cursor-pointer'>
          <Image
              src={post.creator.image}
              alt='user_image'
              width={40}
              height={40}
              className='rounded-full object-contain'
              />

          <div className='flex flex-col'>
            <h3 className='font-satoshi font-semibold text-gray-900'>
              {post.creator.username}
            </h3>
            <p className='font-inter text-sm text-gray-500'>
              {post.creator.email}
            </p>
          </div>
        </div>

        <div className='copy_btn' onClick={handleCopy}>
          <Image
            src={copied === post.PromptCard
              ? '/assets.icons/tick.svg'
              : '/assets/icons/copy.svg'}
            alt='copy'
            width={12}
            height={12}
          />
        </div>
      </div>

      <p className='my-4 font-satoshi text-sm text-gray-700'>{post.prompt}</p>
      <div className='flex justify-between items-center'>
        <p className='font-inter text-sm blue_gradient cursor-pointer'
          onClick={() => handleTagClick && handleTagClick(post.tag)}
        >
          #{post.tag}
        </p>
        <p className='font-inter text-xs text-gray-500'>
          {formattedDate}{isEdited && ' • Edited'}
        </p>
      </div>

      {session?.user.id === post.creator._id && pathName === '/profile' && (
        <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
          <p
            className='font-inter text-sm green_gradient cursor-pointer'
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className='font-inter text-sm orange_gradient cursor-pointer'
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  )
}

export default PromptCard
