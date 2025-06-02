async def react(ctx, *args):
    global react_mode, target_user, reaction_emoji

    if len(args) == 0:
        await ctx.send(```Usage: `+react <@user> <emoji>` or `+react <emoji>`.```)
        return

    # Determine if the first argument is a user mention
    if len(ctx.message.mentions) > 0:
        target_user = ctx.message.mentions[0]
        reaction_emoji = args[1] if len(args) > 1 else None
    else:
        target_user = ctx.author
        reaction_emoji = args[0]

    if not reaction_emoji:
        await ctx.send(```You must provide an emoji to react with.```)
        return

    react_mode = True
    await ctx.send(f```React mode enabled. Reacting with {reaction_emoji} to messages by {target_user.display_name}.```)
