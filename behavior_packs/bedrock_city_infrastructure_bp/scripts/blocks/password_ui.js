import { world } from '@minecraft/server';
import { ActionFormData, MessageFormData, ModalFormData } from '@minecraft/server-ui';

function createPassword(password, confirmPass) {
    if(password.length >= 5 && password.length <= 30) {
        if(password === confirmPass.trim()) {
            return true;
        }
        else if(!confirmPass.trim()){
            return '§eBestätige dein Passwort';
        }
        else {
            return '§cPasswort ist falsch';
        }
    }
    else if(password.length > 30) {
        return '§cPasswort is ungültig! Mehr als 30 Zeichen';
    }
    else {
        return password.trim() ? '§cPasswort ist zu kurz, weniger als 5 Zeichen!' : '§cKein Passwort gesetzt';
    }
}

export function enterPasswordUi(player, lockedBlockId, containerName, mode) {
    const enterPass = new ModalFormData();
    enterPass.title(`${mode} ${containerName}`);
    enterPass.textField('Passwort:', `Gebe Passwort ein`);

    return new Promise(resolve => {
        enterPass.show(player).then(result => {
            if(result.canceled) return;
            const [unlockPass] = result.formValues;
            const blockData = world.getDynamicProperty(lockedBlockId);
            const {password} = JSON.parse(blockData);
            resolve(unlockPass === password);
        })
    });
}

export function lockingUi(player, lockedBlockId, containerName) {
    const lockUi = new ModalFormData();
    lockUi.title(`Sperre ${containerName}`);
    lockUi.textField('Passwort:', 'Erstelle Passwort');
    lockUi.textField('Bestätige Passwort:', 'wiederhole Passwort');
    lockUi.toggle('Benachrichigungen', false);
    lockUi.toggle('Editierbar', false);

    return new Promise(resolve => {
        lockUi.show(player).then(result => {
            if(result.canceled) return;
            const [password, confirmPass, hasNotif, isEditable] = result.formValues;
            const isPassCreated = createPassword(password, confirmPass);

            if(isPassCreated === true) {
                const lockBlockData = {
                    password: password,
                    attemptNotification: hasNotif,
                    restrictEditing: isEditable,
                    owner: player.id
                }

                world.setDynamicProperty(lockedBlockId, JSON.stringify(lockBlockData));
                resolve(true);
            }
            else {
                player.sendMessage(isPassCreated);
                resolve(false);
            }
        })
    })
}

export function editingUi(player, lockedBlockId, containerName) {
    const editUi = new ActionFormData();
    editUi.title(`Bearbeite ${containerName}`);
    editUi.body(':')
    editUi.button('ändere Passwort', 'textures/ui/pencil_edit_icon');
    editUi.button('Bearbeite Einstellungen', 'textures/ui/icon_setting');
    editUi.button('lösche Passwort', 'textures/ui/icon_trash');

    return new Promise(resolve => {
        editUi.show(player).then(result => {
            if(result.canceled) return;
            const selectedAction = result.selection;
            const blockData = world.getDynamicProperty(lockedBlockId);
            const {password, attemptNotification, restrictEditing, owner} = JSON.parse(blockData);

            switch(selectedAction) {
                case 0:
                    const changePass = new ModalFormData();
                    changePass.title('ändere Password');
                    changePass.textField('neues Passwort:', 'Schreibe neues Passwort');
                    changePass.textField('Bestätige Passwoer:', 'wiederhole neues Passwort');

                    changePass.show(player).then(result => {
                        if(result.canceled) {
                            editingUi(player, lockedBlockId, containerName);
                        }
                        else {
                            const [newPassword, confirmPass] = result.formValues;
                            if(newPassword === password) {
                                player.sendMessage('§cDas neue Passwort kann nicht dem altem entsprechen! Gebe anderes Passwort ein.');
                            }
                            else {
                                const isPassCreated = createPassword(newPassword, confirmPass);
                                if(isPassCreated === true) {
                                    const newBlockData = {
                                        password: newPassword,
                                        attemptNotification: attemptNotification,
                                        restrictEditing: restrictEditing,
                                        owner: owner
                                    }

                                    player.sendMessage('[§bi§f] §7Neues Passwort erfolgreich gesetzt.');
                                    world.setDynamicProperty(lockedBlockId, JSON.stringify(newBlockData));
                                    resolve(true);
                                }
                                else {
                                    player.sendMessage(isPassCreated);
                                }
                            }
                        }
                    })
                break;
                case 1:
                    const editUi = new ModalFormData();
                    editUi.title('Einstellungen');
                    editUi.toggle('Benachrichtungen', attemptNotification);
                    editUi.toggle('Editierbar', restrictEditing);

                    editUi.show(player).then(result => {
                        if(result.canceled) {
                            editingUi(player, lockedBlockId, containerName);
                        }
                        else {
                            const [newAttemptNot, newRestrictEdit] = result.formValues;
                            const newBlockData = {
                                password: password,
                                attemptNotification: newAttemptNot,
                                restrictEditing: newRestrictEdit,
                                owner: owner
                            }

                            world.setDynamicProperty(lockedBlockId, JSON.stringify(newBlockData));
                            player.sendMessage(`[§bi§f] §a${containerName}'s §7Einstellungen wurden gesetzt`);
                            resolve(true);
                        }
                    })
                break;
                case 2:
                    const confirmUi = new MessageFormData();
                    confirmUi.title('Lösung Passwort?');
                    confirmUi.body('Du hast die Löschung deines Passworts eingeleitet. Diese Aktion ist nicht rückgängig machbar und führt zum dauerhaften Verlust der damit verbundenen Daten. Möchtest du fortfahren?                    ');
                    confirmUi.button1('Abbrechen');
                    confirmUi.button2('Löschung bestätigen');
    
                    confirmUi.show(player).then(result => {
                        if(result.selection) {
                            player.sendMessage('[§Bi§f] §7Passwort §7wurde §cgelöscht');
                            world.setDynamicProperty(lockedBlockId, undefined);
                            resolve(true);
                        }
                        else {
                            editingUi(player, lockedBlockId, containerName);
                        }
                    })
                break;
            }
        })
    })
}