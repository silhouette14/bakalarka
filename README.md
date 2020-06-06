<h1>Crypto Js Backend</h1>

<h1>Un-Authenticated Calls</h1>

<h2>Register Call</h2>
<h4>Method: POST</h4>
<h4>URL:  /register</h4>
<h3>Params in Body:</h3>
<p>
name:String,</br>
email: String,</br>
password: String,</br>
mobile: Number,</br>
username: String,</br>
country : String</br>
</p>
<h3>Response:</h3>
<h4>Status Code: 303</h4>
<p>
message:"email already exists."
</p>
<h4>Status Code: 303</h4>
<p>
message:"email already exists."</br>
OR
message:"mobile already exists."</br>
OR
message:"Username already exists."</br>
</p>
<h4>Status Code: 303</h4>
<p>
message:"email already exists."
</p>
<h4>Status Code: 202</h4>
<p>
message:"User account created successfully."
</p>



<h2>LOGIN Call</h2>
<h4>Method: POST</h4>
<h4>URL:  /authenticate</h4>
<h3>Params in Body:</h3>
<p>

email: String,</br>
password: String</br>
</p>
<h3>Response:</h3>
<h4>Status Code: 200</h4>
<p>
{ success: true, </br>token: 'JWT ' + token, </br>user: found}
</p>
<h4>Status Code: 401</h4>
<p>
{ success: false, </br>message: 'password did not match.' }</br>
OR</br>
{ success: false, message: 'user not found' }
</br>
</p>
<h4>Status Code: 403</h4>
<p>
{ message: "Perameters Missing" }
</p>


<h2>Email Exist Check</h2>
<h4>Method: POST</h4>
<h4>URL:  /checkEmail</h4>
<h3>Params in Body:</h3>
<p>
email: String</br>
</p>
<h3>Response:</h3>
<h4>Status Code: 200</h4>
<p>
{result:result,</br>message:"email already exists"}
</p>
<h4>Status Code: 404</h4>
<p>
{ message:"Email does not exists."}</br>
</p>


<h2>Get Single Coin Price</h2>
<h4>Method: POST</h4>
<h4>URL:  /getSinglePrice</h4>
<h3>Params in Body:</h3>
<p>
coinName: String</br>
</p>
<h3>Response:</h3>
<h4>Status Code: 200</h4>
<p>
{ coinName : ticker[params.coinName] }
</p>


<h2>Get Single Coin Price</h2>
<h4>Method: GET</h4>
<h4>URL:  /getAllPrice</h4>

<h3>Response:</h3>
<h4>Status Code: 200</h4>
<p>
{ price : ticker }
</p>


<h2>Get Bid Ask Price for Single Coin</h2>
<h4>Method: POST</h4>
<h4>URL:  /bidAskPrice</h4>
<h3>Params in Body:</h3>
<p>
coinName: String</br>
</p>
<h3>Response:</h3>
<h4>Status Code: 200</h4>
<p>
{ ticker : ticker }
</p>

<h2>Get Bid Ask Price for All Coin</h2>
<h4>Method: GET</h4>
<h4>URL:  /bidAskPriceAll</h4>

<h3>Response:</h3>
<h4>Status Code: 200</h4>
<p>
{ ticker : ticker }
</p>


<h2>Get market Depth of Single Coin</h2>
<h4>Method: POST</h4>
<h4>URL:  /singleMarketDepth</h4>
<h3>Params in Body:</h3>
<p>
coinName: String</br>
</p>
<h3>Response:</h3>
<h4>Status Code: 200</h4>
<p>
{ symbol : depth }
</p>

<h2>Candle Stick REST call for Single Coin</h2>
<h4>Method: POST</h4>
<h4>URL:  /candleStickCall</h4>
<h3>Params in Body:</h3>
<p>
coinName: String</br>
time: 1m , 2m , .....  5m , etc</br>
</p>
<h3>Response:</h3>
<h4>Status Code: 200</h4>
<p>
{ coinName : symbol ,</br> ticks : ticks }
</p>
