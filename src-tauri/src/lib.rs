mod commands;

use commands::*;
use tauri::{Emitter, Manager, WindowEvent};
#[cfg(target_os = "macos")]
use tauri::menu::{AboutMetadataBuilder, MenuBuilder, MenuItemBuilder, SubmenuBuilder};

#[cfg(target_os = "macos")]
#[allow(deprecated)]
fn sync_mac_traffic_lights(window: &tauri::WebviewWindow) {
    let win = window.clone();
    let win_closure = win.clone();
    let _ = win.run_on_main_thread(move || {
        #[allow(deprecated)]
        use cocoa::base::{id, nil, BOOL, YES};
        #[allow(deprecated)]
        use cocoa::foundation::{NSPoint, NSRect};
        use objc::{class, msg_send, sel, sel_impl};

        if let Ok(ns_win_ptr) = win_closure.ns_window() {
            let ns_window = ns_win_ptr as id;
            if ns_window == nil {
                return;
            }
            unsafe {
                let style_mask: u64 = msg_send![ns_window, styleMask];
                if (style_mask & (1 << 14)) != 0 {
                    return;
                }

                for (i, btn_id) in [0usize, 1usize, 2usize].iter().enumerate() {
                    let btn: id = msg_send![ns_window, standardWindowButton: *btn_id];
                    if btn != nil {
                        let is_hidden: BOOL = msg_send![btn, isHidden];
                        if is_hidden == YES {
                            continue;
                        }
                        let reference: id = msg_send![class!(NSWindow),
                            standardWindowButton: *btn_id forStyleMask: style_mask];
                        if reference == nil {
                            continue;
                        }
                        let reference_frame: NSRect = msg_send![reference, frame];
                        let reference_bounds: NSRect = msg_send![reference, bounds];
                        let control_size: u64 = msg_send![reference, controlSize];
                        let _: () = msg_send![btn, setControlSize: control_size];

                        let content_view: id = msg_send![ns_window, contentView];
                        let superview: id = msg_send![btn, superview];
                        if content_view == nil || superview == nil {
                            continue;
                        }
                        let content_bounds: NSRect = msg_send![content_view, bounds];
                        let is_flipped: BOOL = msg_send![content_view, isFlipped];
                        let toolbar_center_from_top = 15.5_f64;
                        let toolbar_center_y = if is_flipped == YES {
                            toolbar_center_from_top
                        } else {
                            content_bounds.size.height - toolbar_center_from_top
                        };
                        let content_center = NSPoint {
                            x: content_bounds.origin.x + 14.0 + (i as f64) * 20.0,
                            y: content_bounds.origin.y + toolbar_center_y,
                        };
                        let native_center: NSPoint = msg_send![superview,
                            convertPoint: content_center fromView: content_view];
                        let target_x = native_center.x - reference_frame.size.width / 2.0;
                        let target_y = native_center.y - reference_frame.size.height / 2.0;
                        let target_frame = NSRect {
                            origin: NSPoint {
                                x: target_x,
                                y: target_y,
                            },
                            size: reference_frame.size,
                        };
                        let _: () = msg_send![btn, setFrame: target_frame];
                        let _: () = msg_send![btn, setBounds: reference_bounds];
                    }
                }
            }
        }
    });
}

#[cfg(target_os = "macos")]
fn rebuild_mac_app_menu(app: &tauri::AppHandle, lang: &str) {
    let is_en = lang.eq_ignore_ascii_case("en");
    let settings_label = if is_en { "Settings…" } else { "Cài đặt…" };
    let open_folder_label = if is_en { "Open Folder…" } else { "Mở thư mục…" };
    let select_all_label = if is_en { "Select All" } else { "Chọn tất cả" };
    let deselect_all_label = if is_en { "Deselect All" } else { "Bỏ chọn tất cả" };
    let view_grid_label = if is_en { "Grid View" } else { "Chế độ lưới ảnh" };
    let view_detail_label = if is_en { "Detail List View" } else { "Chế độ danh sách chi tiết" };
    let toggle_sidebar_label = if is_en { "Toggle Sidebar" } else { "Bật/Tắt thanh bên" };
    let toggle_info_label = if is_en { "Toggle Photo Info" } else { "Bật/Tắt thông tin ảnh" };
    let rotate_photo_label = if is_en { "Rotate JPEG 90° via EXIF" } else { "Xoay JPEG 90° qua EXIF" };
    let batch_rename_label = if is_en { "Batch Rename…" } else { "Đổi tên hàng loạt…" };
    let file_menu_label = if is_en { "File" } else { "Tệp" };
    let edit_menu_label = if is_en { "Edit" } else { "Chỉnh sửa" };
    let view_menu_label = if is_en { "View" } else { "Hiển thị" };
    let tools_menu_label = if is_en { "Tools" } else { "Công cụ" };

    let about_comments = if is_en {
        "Ultra-lightweight photo culling and batch manager"
    } else {
        "Trình duyệt và chọn lọc ảnh cá nhân siêu nhẹ"
    };
    let about_credits = if is_en {
        "Bùi Việt Linh\nPhoto culling, EXIF filtering, lossless JPEG rotation, and safe batch renaming.\nGitHub: https://github.com/linhbv94/VXPhotos"
    } else {
        "Bùi Việt Linh\nTiện ích tuyển chọn, phân loại ảnh theo EXIF, xoay JPEG qua EXIF và đổi tên hàng loạt an toàn.\nGitHub: https://github.com/linhbv94/VXPhotos"
    };

    let build_menu = || -> tauri::Result<tauri::menu::Menu<tauri::Wry>> {
        let mut about_builder = AboutMetadataBuilder::new()
            .name(Some("VXPhotos"))
            .version(Some(env!("CARGO_PKG_VERSION")))
            // Empty AppKit build version prevents fallback to CFBundleVersion.
            .short_version(Some(""))
            .copyright(Some("© 2026 Bùi Việt Linh. All rights reserved."))
            .authors(Some(vec!["Bùi Việt Linh".into()]))
            .comments(Some(about_comments))
            .website(Some("https://github.com/linhbv94/VXPhotos"))
            .website_label(Some("GitHub — VXPhotos"))
            .credits(Some(about_credits));
        about_builder = about_builder.icon(Some(tauri::include_image!("icons/icon.png")));

        let settings_item = MenuItemBuilder::with_id("open_settings", settings_label)
            .accelerator("CmdOrCtrl+,")
            .build(app)?;

        let app_submenu = SubmenuBuilder::new(app, "VXPhotos")
            .about(Some(about_builder.build()))
            .separator()
            .item(&settings_item)
            .separator()
            .services()
            .separator()
            .hide()
            .hide_others()
            .show_all()
            .separator()
            .quit()
            .build()?;

        let open_folder = MenuItemBuilder::with_id("open_folder", open_folder_label)
            .accelerator("CmdOrCtrl+O")
            .build(app)?;

        let file_submenu = SubmenuBuilder::new(app, file_menu_label)
            .item(&open_folder)
            .separator()
            .close_window()
            .build()?;

        let select_all = MenuItemBuilder::with_id("select_all", select_all_label)
            .accelerator("CmdOrCtrl+A")
            .build(app)?;
        let deselect_all = MenuItemBuilder::with_id("deselect_all", deselect_all_label)
            .accelerator("Escape")
            .build(app)?;

        let edit_submenu = SubmenuBuilder::new(app, edit_menu_label)
            .item(&select_all)
            .item(&deselect_all)
            .build()?;

        let view_grid = MenuItemBuilder::with_id("view_grid", view_grid_label)
            .accelerator("CmdOrCtrl+1")
            .build(app)?;
        let view_detail = MenuItemBuilder::with_id("view_detail", view_detail_label)
            .accelerator("CmdOrCtrl+2")
            .build(app)?;
        let toggle_sidebar = MenuItemBuilder::with_id("toggle_sidebar", toggle_sidebar_label)
            .accelerator("CmdOrCtrl+B")
            .build(app)?;
        let toggle_info = MenuItemBuilder::with_id("toggle_info", toggle_info_label)
            .accelerator("CmdOrCtrl+I")
            .build(app)?;

        let view_submenu = SubmenuBuilder::new(app, view_menu_label)
            .item(&view_grid)
            .item(&view_detail)
            .separator()
            .item(&toggle_sidebar)
            .item(&toggle_info)
            .build()?;

        let rotate_photo = MenuItemBuilder::with_id("rotate_photo", rotate_photo_label)
            .accelerator("R")
            .build(app)?;
        let batch_rename = MenuItemBuilder::with_id("batch_rename", batch_rename_label)
            .accelerator("CmdOrCtrl+R")
            .build(app)?;

        let tools_submenu = SubmenuBuilder::new(app, tools_menu_label)
            .item(&rotate_photo)
            .item(&batch_rename)
            .build()?;

        MenuBuilder::new(app)
            .item(&app_submenu)
            .item(&file_submenu)
            .item(&edit_submenu)
            .item(&view_submenu)
            .item(&tools_submenu)
            .build()
    };

    if let Ok(menu) = build_menu() {
        let _ = app.set_menu(menu);
    }
}

#[tauri::command]
fn set_app_language(app: tauri::AppHandle, lang: String) {
    #[cfg(target_os = "macos")]
    rebuild_mac_app_menu(&app, &lang);
    #[cfg(not(target_os = "macos"))]
    let _ = (app, lang);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            #[cfg(target_os = "macos")]
            {
                if let Some(main_win) = app.get_webview_window("main") {
                    sync_mac_traffic_lights(&main_win);
                }
                rebuild_mac_app_menu(app.handle(), "vi");
            }

            #[cfg(target_os = "windows")]
            {
                use tauri::Manager;
                if let Some(main_win) = app.get_webview_window("main") {
                    let _ = main_win.set_decorations(false);
                }
            }
            Ok(())
        })
        .on_menu_event(|app_handle, event| match event.id().as_ref() {
            "open_folder" => {
                let _ = app_handle.emit("trigger-open-folder", ());
            }
            "open_settings" => {
                if let Some(win) = app_handle.get_webview_window("main") {
                    let _ = win.show();
                    let _ = win.set_focus();
                }
                let _ = app_handle.emit("trigger-open-settings", ());
            }
            "select_all" => {
                let _ = app_handle.emit("trigger-select-all", ());
            }
            "deselect_all" => {
                let _ = app_handle.emit("trigger-deselect-all", ());
            }
            "view_grid" => {
                let _ = app_handle.emit("trigger-view-grid", ());
            }
            "view_detail" => {
                let _ = app_handle.emit("trigger-view-detail", ());
            }
            "toggle_sidebar" => {
                let _ = app_handle.emit("trigger-toggle-sidebar", ());
            }
            "toggle_info" => {
                let _ = app_handle.emit("trigger-toggle-info", ());
            }
            "rotate_photo" => {
                let _ = app_handle.emit("trigger-rotate-photo", ());
            }
            "batch_rename" => {
                let _ = app_handle.emit("trigger-batch-rename", ());
            }
            _ => {}
        })
        .on_window_event(|window, event| {
            #[cfg(target_os = "macos")]
            if matches!(
                event,
                WindowEvent::Resized(_) | WindowEvent::Focused(true) | WindowEvent::ScaleFactorChanged { .. }
            ) {
                if let Some(webview) = window.app_handle().get_webview_window(window.label()) {
                    sync_mac_traffic_lights(&webview);
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            set_app_language,
            read_directory,
            get_subfolders,
            create_subfolder,
            rotate_lossless,
            preview_batch_rename,
            apply_batch_rename,
            move_or_copy_files,
            select_folder_dialog,
            reveal_in_file_manager,
            open_in_system_viewer,
            open_native_preview,
            move_to_trash,
            clipboard_files,
            preview_file_operation,
            list_file_recovery,
            restore_file_operation,
            commands::file_safety::prepare_app_update,
            commands::file_safety::cancel_app_update,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
