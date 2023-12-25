import PromptCard from './PromptCard'



const Profile = ({ name, desc, data, handleEdit, handleDelete, handleDeleteAccount, isDeleting }) => {
  return (
    <section className='w-full'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{name} Profile</span>
      </h1>
      <p className='desc text-left'>
        {desc}
      </p>
      <div className='flex justify-end my-4 w-full'>
      {isDeleting ? (
          <div>Deleting account...</div>
        ) : (
          <button className='delete-account-btn' onClick={handleDeleteAccount}>Delete My Account</button>
        )}
      </div>
      <div className='mt-10 prompt_layout'>
      {data.map((post) => (
        <PromptCard
        key={post._id}
        post={post}
        handleEdit={() => handleEdit && handleEdit(post)}
        handleDelete={() => handleDelete && handleDelete(post)}
        />
        ))}
    </div>
    </section>
  )
}

export default Profile
