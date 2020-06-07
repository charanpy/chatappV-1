call doCallback=(callback)=>{
	setTimeout(()=>{
		callback("error",undefined)

	},2000)


}

doCallback((error,res)=>{
	if(error){
		return console.log(error)

	}
	else{
		console.log(res)
	}
})