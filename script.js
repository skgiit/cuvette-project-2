document.addEventListener('DOMContentLoaded', () => {
    const groupsContainer = document.getElementById('groupsContainer');
    const groupTitle = document.getElementById('groupTitle');
    const messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const createGroupBtn = document.getElementById('createGroupBtn');
    const createGroupModal = document.getElementById('createGroupModal');
    const closeModal = document.getElementById('closeModal');
    const groupNameInput = document.getElementById('groupNameInput');
    const colorOptions = document.querySelectorAll('.color-option');
    const createGroup = document.getElementById('createGroup');
    const groupHeaderIcon = document.getElementById('groupHeaderIcon');
    const groupHeader = document.getElementById('groupHeader');
    const content = document.getElementById('content');

    let selectedGroupColor = '#9b59b6';
    let groups = JSON.parse(localStorage.getItem('groups')) || [];
    let selectedGroupIndex = null;
    let lastMessage = '';

    function saveGroupsToLocalStorage() {
        localStorage.setItem('groups', JSON.stringify(groups));
    }

    function renderGroups() {
        groupsContainer.innerHTML = '';
        groups.forEach((group, index) => {
            const groupElement = document.createElement('div');
            groupElement.classList.add('group');
            if (index === selectedGroupIndex) {
                groupElement.classList.add('selected');
            }
            groupElement.innerHTML = `
                <div class="group-icon" style="background-color: ${group.color};">${getGroupIconText(group.name)}</div>
                <div>${group.name}</div>
            `;
            groupElement.addEventListener('click', () => {
                selectedGroupIndex = index;
                renderGroups();
                renderMessages();
                renderGroupHeader();
                messageInput.style.display = 'block';
                sendMessageBtn.style.display = 'block';
                content.style.display = 'flex';
                messageInput.value = '';
            });
            groupsContainer.appendChild(groupElement);
        });
    }

    function getGroupIconText(name) {
        const words = name.split(' ');
        if (words.length > 1) {
            return words[0][0].toUpperCase() + words[1][0].toUpperCase();
        } else {
            return name.substring(0, 2).toUpperCase();
        }
    }

    function renderMessages() {
        if (selectedGroupIndex !== null) {
            messagesContainer.innerHTML = '';
            groups[selectedGroupIndex].messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                const [date, time] = message.timestamp.split(' ');
                messageElement.innerHTML = `
                    <div class="message-time">
                        <div class="message-date">${date}</div>
                        <div class="message-hour">${time}</div>
                    </div>
                    <div class="message-text">${message.text}</div>
                `;
                messagesContainer.appendChild(messageElement);
            });
        } else {
            messagesContainer.innerHTML = '';
        }
    }

    function renderGroupHeader() {
        if (selectedGroupIndex !== null) {
            groupHeaderIcon.style.backgroundColor = groups[selectedGroupIndex].color;
            groupHeaderIcon.textContent = getGroupIconText(groups[selectedGroupIndex].name);
            groupTitle.textContent = groups[selectedGroupIndex].name;
        } else {
            groupHeaderIcon.style.backgroundColor = 'transparent';
            groupHeaderIcon.textContent = '';
            groupTitle.textContent = 'Select a group';
            messageInput.style.display = 'none';
            sendMessageBtn.style.display = 'none';
            content.style.display = 'none';
        }
    }

    sendMessageBtn.addEventListener('click', () => {
        if (selectedGroupIndex !== null && messageInput.value.trim() !== '' && messageInput.value.trim() !== lastMessage) {
            const message = {
                timestamp: new Date().toLocaleString(),
                text: messageInput.value.trim()
            };
            groups[selectedGroupIndex].messages.push(message);
            saveGroupsToLocalStorage();
            renderMessages();
            lastMessage = message.text;
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });

    createGroupBtn.addEventListener('click', () => {
        createGroupModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        createGroupModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === createGroupModal) {
            createGroupModal.style.display = 'none';
        }
    });

    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedGroupColor = option.getAttribute('data-color');
        });
    });

    createGroup.addEventListener('click', () => {
        const groupName = groupNameInput.value.trim();
        if (groupName !== '') {
            const newGroup = {
                name: groupName,
                color: selectedGroupColor,
                messages: []
            };
            groups.push(newGroup);
            saveGroupsToLocalStorage();
            renderGroups();
            createGroupModal.style.display = 'none';
            groupNameInput.value = '';
            colorOptions.forEach(option => option.classList.remove('selected'));
            colorOptions[0].classList.add('selected');
            selectedGroupColor = '#9b59b6';
        }
    });

    renderGroups();
    renderMessages();
    renderGroupHeader();
});
