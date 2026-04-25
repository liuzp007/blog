#!/bin/bash
prefix="test-"

if `git status | grep "master" &>/dev/null`; then
    prefix="pro-"
fi

if [ $1 ] && [ $1 = "pre-" ]; then
    prefix="pre-"
fi

function new-tag() {
    git push
    git pull --tags
    local new_tag=$(echo ${prefix}new-$(date +'%Y%m%d')-$(git tag -l "${prefix}new-$(date +'%Y%m%d')-*" | wc -l | xargs printf '%02d'))
    echo ${new_tag}
    git tag ${new_tag}
    git push origin $new_tag
}

new-tag;

