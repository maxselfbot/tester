@bot.command()
async def react_off(ctx):
    global react_mode
    react_mode = False
    await ctx.send("React mode disabled.")
    
bot.run(token)
