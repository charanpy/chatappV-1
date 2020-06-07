const doPromises=new Promise((resolve,reject)=>{

	setTimeout(()=>{
		//resolve([1,2,3])
//only one thing can be called resolve or reject
reject("error")

},2000)

})
//then is called when function goes well
doPromises.then((result)=>{
	console.log(result)
}).catch((error)=>{
	console.log(error)

})

//catch works when functiondoes not go well
