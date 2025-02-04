postsData?.data.map((post) => (
    <tr>
    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <a href="/" className="relative block">
                    <img  src={post?.photo ? stables.UPLOAD_FOLDER_BASE_URL + post?.photo : images.samplePostImage} alt={post.title} className="mx-auto object-cover rounded-lg aspect-square w-10 "/>
                </a>
            </div>
            <div className="ml-3">
                <p className="text-gray-900 whitespace-no-wrap">
                    {post.title}
                </p>
            </div>
        </div>
    </td>
 
    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
        <p className="text-gray-900 whitespace-no-wrap">
        
            {post.categories.length >0 ? post.categories.slice(0, 3).map((category, index) => (
              ` ${category.title} ${post.categories.slice(0,3).length === index+1 ? "" : ", "}`
              )): "Uncategorised"}
        </p>
    </td>
    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
        <p className="text-gray-900 whitespace-no-wrap">
          {new Date(post.createdAt).toLocaleDateString(
            "en-US",
            {
              day:"numeric",
              month:"short",
              year:"numeric",
            }
          )}
        </p>
    </td>
    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
       <div className="flex gap-x-2 ">
        {post.tags.length > 0 ? post.tags.map((tag, index) => (
          <p>{tag}{post.tags.length-1!==index && ','}</p>
        )) :"No tags"}
       </div>
    </td>
    <td className=" space-x-5 px-5 py-5 text-sm bg-white border-b border-gray-200">
        <button
         disabled={isLoadingDeleteData} 
         type="button"
          className="text-red-600 hover:text-red-900 
           disabled:opacity-70 disabled:cursor-not-allowed"
           onClick={() => deleteDataHandler({slug:post?.slug, token:userState.userInfo.token})}>Delete</button>
        <Link to={`/admin/posts/edit/${post?.slug}`} className="text-green-600 hover:text-green-900">
            Edit
        </Link>
    </td>
</tr>

   ))