const totalLikes = (blogs) => {
    return blogs.map(blog => blog.likes).reduce((a,b) => a + b)
}

const favouriteBlog = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    let mostLikes = -1
    for(const like of likes) {
        if(like>mostLikes) {
            mostLikes = like
        }
    }
    return blogs[(likes.indexOf(mostLikes))]

}

const mostBlogs = (blogs) => {
    const authors = blogs.map(blog => blog.author)
    const uniqueAuthors = []
    for(const author of authors) {
        if(!uniqueAuthors.some(uniqueAuthor => uniqueAuthor.author === author)){
            uniqueAuthors.push({
                "author": author,
                blogs: 1
            })
        } else {
            uniqueAuthors[uniqueAuthors.findIndex(uniqueAuthor => uniqueAuthor.author === author)].blogs += 1
        }
    }
    let blogsNumber = 0
    let mostBlogPosts = {}
    for(const author of uniqueAuthors){
        if(author.blogs > blogsNumber) {
            blogsNumber = author.blogs
            mostBlogPosts = author
        }
    }
    return mostBlogPosts
}

const mostLikes = (blogs) => {
    const authors = (blogs.map(blog => blog.author))
    const newBlogs = []
    for(const author of authors) {
        if(!newBlogs.some(blog => blog.author === author)) {
            newBlogs.push({
                "author": author,
                "likes": 0
            })
        }
    }

    for(const newBlog of newBlogs) {
        for(const blog of blogs) {
            if(newBlog.author === blog.author) {
                newBlog.likes += blog.likes
            }
        }
    }

    let mostLikes = 0
    let largest = {}
    for(const blog of newBlogs) {
        if(blog.likes>mostLikes){
            mostLikes=blog.likes
            largest = blog
        }
    }

    return largest

}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}