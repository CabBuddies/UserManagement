const f = (s:any='none') => {
    return () => {
        console.log(s)
    }
}
export default f;